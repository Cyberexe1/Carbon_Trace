// =============================================================================
// SECTION: Activities Routes
// All routes are protected — require a valid JWT.
//
// GET    /api/activities          — list activities (paginated, filterable)
// POST   /api/activities          — log a new activity
// GET    /api/activities/summary  — daily/weekly/monthly totals by category
// GET    /api/activities/:id      — single activity
// PUT    /api/activities/:id      — update an activity
// DELETE /api/activities/:id      — delete an activity
// =============================================================================

'use strict';

const express  = require('express');
const { body, query, param } = require('express-validator');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { validate }    = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth); // All activity routes require authentication

// =============================================================================
// GET /api/activities
// Query params: page (default 1), limit (default 20), category, date_from, date_to
// Returns paginated list of activities + total count.
// =============================================================================
router.get('/', async (req, res, next) => {
  const userId   = req.user.id;
  const page     = Math.max(1, parseInt(req.query.page)  || 1);
  const limit    = Math.min(50, parseInt(req.query.limit) || 20);
  const offset   = (page - 1) * limit;
  const category = req.query.category || null;
  const dateFrom = req.query.date_from || null;
  const dateTo   = req.query.date_to   || null;

  try {
    // Build dynamic WHERE conditions
    const conditions = ['user_id = $1'];
    const params     = [userId];
    let idx = 2;

    if (category) { conditions.push(`category = $${idx++}`); params.push(category); }
    if (dateFrom) { conditions.push(`logged_date >= $${idx++}`); params.push(dateFrom); }
    if (dateTo)   { conditions.push(`logged_date <= $${idx++}`); params.push(dateTo); }

    const where = conditions.join(' AND ');

    const [rows, countRow] = await Promise.all([
      pool.query(
        `SELECT id, category, subtype, quantity, unit, carbon_kg, notes, logged_date, created_at
         FROM activities
         WHERE ${where}
         ORDER BY logged_date DESC, created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM activities WHERE ${where}`, params),
    ]);

    res.json({
      activities: rows.rows,
      total:      parseInt(countRow.rows[0].count),
      page,
      limit,
      pages:      Math.ceil(parseInt(countRow.rows[0].count) / limit),
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// GET /api/activities/summary
// Returns total carbon_kg grouped by category for a given period.
// Query: period = today | week | month | year (default: month)
// =============================================================================
router.get('/summary', async (req, res, next) => {
  const userId = req.user.id;
  const period = req.query.period || 'month';

  // Plain interval strings — passed as $2 parameter, not interpolated
  const intervalMap = {
    today: '1 day',
    week:  '7 days',
    month: '30 days',
    year:  '365 days',
  };

  const since = intervalMap[period] || intervalMap.month;

  try {
    const { rows } = await pool.query(
      `SELECT
         category,
         ROUND(SUM(carbon_kg)::numeric, 3)   AS total_kg,
         COUNT(*)                             AS activity_count
       FROM activities
       WHERE user_id = $1
         AND logged_date >= NOW() - $2::interval
       GROUP BY category
       ORDER BY total_kg DESC`,
      [userId, since]
    );

    // Also return the grand total
    const grandTotal = rows.reduce((sum, r) => sum + parseFloat(r.total_kg), 0);

    res.json({
      period,
      totalKg:    Math.round(grandTotal * 1000) / 1000,
      categories: rows,
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// GET /api/activities/trend
// Returns daily carbon totals for the last N days (default 7).
// Used to draw the sparkline/area chart on the dashboard.
// =============================================================================
router.get('/trend', async (req, res, next) => {
  const userId = req.user.id;
  const days   = Math.min(365, parseInt(req.query.days) || 7);

  try {
    const { rows } = await pool.query(
      `SELECT
         logged_date::text                   AS date,
         ROUND(SUM(carbon_kg)::numeric, 3)   AS total_kg
       FROM activities
       WHERE user_id = $1
         AND logged_date >= CURRENT_DATE - ($2 || ' days')::interval
       GROUP BY logged_date
       ORDER BY logged_date ASC`,
      [userId, days]
    );
    res.json({ days, trend: rows });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// POST /api/activities
// Body: { category, subtype, quantity, unit, carbon_kg, notes, logged_date }
// =============================================================================
const activityRules = [
  body('category').isIn(['transport','diet','energy','shopping','waste'])
    .withMessage('category must be one of: transport, diet, energy, shopping, waste'),
  body('subtype').trim().notEmpty().withMessage('subtype is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('quantity must be a non-negative number'),
  body('unit').trim().notEmpty().withMessage('unit is required'),
  body('carbon_kg').isFloat({ min: 0 }).withMessage('carbon_kg must be a non-negative number'),
  // Sanitize notes — trim whitespace and escape HTML to prevent XSS if ever rendered unsanitized
  body('notes').optional().trim().escape().isLength({ max: 500 }).withMessage('notes max 500 characters'),
  body('logged_date').optional().isISO8601().withMessage('logged_date must be a valid date'),
];

router.post('/', activityRules, validate, async (req, res, next) => {
  const { category, subtype, quantity, unit, carbon_kg, notes = '', logged_date } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO activities (user_id, category, subtype, quantity, unit, carbon_kg, notes, logged_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, category, subtype, parseFloat(quantity), unit,
       parseFloat(carbon_kg), notes, logged_date || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// GET /api/activities/:id
// =============================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Activity not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// PUT /api/activities/:id
// =============================================================================
router.put('/:id', activityRules, validate, async (req, res, next) => {
  const { category, subtype, quantity, unit, carbon_kg, notes = '', logged_date } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE activities
       SET category=$1, subtype=$2, quantity=$3, unit=$4,
           carbon_kg=$5, notes=$6, logged_date=$7
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [category, subtype, parseFloat(quantity), unit, parseFloat(carbon_kg),
       notes, logged_date || new Date().toISOString().split('T')[0],
       req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Activity not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// DELETE /api/activities/:id
// =============================================================================
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM activities WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Activity not found.' });
    res.json({ message: 'Activity deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
