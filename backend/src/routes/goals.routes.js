// =============================================================================
// SECTION: Goals Routes
// All routes are protected.
//
// GET    /api/goals          — list user's goals (filter by status)
// POST   /api/goals          — create a new goal
// PATCH  /api/goals/:id      — update progress or status
// DELETE /api/goals/:id      — delete a goal
// =============================================================================

'use strict';

const express = require('express');
const { body } = require('express-validator');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { validate }    = require('../middleware/validate');
const { GOAL_CATEGORIES, GOAL_STATUSES } = require('../constants');

// Columns returned to clients — explicit list avoids leaking future columns
const GOAL_COLUMNS = 'id, user_id, title, category, target_kg, progress_kg, deadline, status, created_at, updated_at';

const router = express.Router();
router.use(requireAuth);

// =============================================================================
// GET /api/goals
// Query: status = active | completed | failed | all (default: active)
// =============================================================================
router.get('/', async (req, res, next) => {
  const userId = req.user.id;
  const status = req.query.status || 'active';
  const VALID_STATUSES = [...GOAL_STATUSES, 'all'];
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const where = status === 'all' ? 'user_id = $1' : 'user_id = $1 AND status = $2';
    const params = status === 'all' ? [userId] : [userId, status];

    const { rows } = await pool.query(
      `SELECT id, title, category, target_kg, progress_kg,
              ROUND((progress_kg / NULLIF(target_kg,0) * 100)::numeric, 1) AS progress_pct,
              deadline, status, created_at, updated_at
       FROM goals
       WHERE ${where}
       ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// POST /api/goals
// Body: { title, category, target_kg, deadline }
// =============================================================================
const goalRules = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('category').isIn(GOAL_CATEGORIES)
    .withMessage('Invalid category'),
  body('target_kg').isFloat({ min: 0.1 }).withMessage('target_kg must be greater than 0'),
  body('deadline').isISO8601().withMessage('deadline must be a valid date'),
];

router.post('/', goalRules, validate, async (req, res, next) => {
  const { title, category, target_kg, deadline } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO goals (user_id, title, category, target_kg, deadline)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${GOAL_COLUMNS}`,
      [req.user.id, title, category, parseFloat(target_kg), deadline]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// PATCH /api/goals/:id
// Body: { progress_kg?, status? }
// Automatically marks as 'completed' when progress_kg >= target_kg.
// Single round-trip: COALESCE keeps unchanged fields, CASE auto-completes.
// =============================================================================
const patchGoalRules = [
  body('progress_kg').optional().isFloat({ min: 0 }).withMessage('progress_kg must be a non-negative number'),
  body('status').optional().isIn(GOAL_STATUSES).withMessage('Invalid status'),
];

router.patch('/:id', patchGoalRules, validate, async (req, res, next) => {
  const { progress_kg, status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE goals
       SET progress_kg = COALESCE($1, progress_kg),
           status = COALESCE($2, CASE
             WHEN COALESCE($1, progress_kg) >= target_kg THEN 'completed'
             ELSE status
           END),
           updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING ${GOAL_COLUMNS}`,
      [
        progress_kg !== undefined ? parseFloat(progress_kg) : null,
        status || null,
        req.params.id,
        req.user.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Goal not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// DELETE /api/goals/:id
// =============================================================================
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Goal not found.' });
    res.json({ message: 'Goal deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
