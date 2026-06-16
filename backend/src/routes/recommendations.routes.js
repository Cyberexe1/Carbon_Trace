// =============================================================================
// SECTION: Recommendations Routes
// All routes are protected.
//
// GET   /api/recommendations       — fetch today's recommendations for user
// POST  /api/recommendations/seed  — generate/seed 3 static recommendations
// PATCH /api/recommendations/:id   — mark as done | skip
// =============================================================================

'use strict';

const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Static fallback recommendations (used when no AI is available)
const FALLBACK_TIPS = [
  { title: 'Switch to public transit on Tuesdays',  description: 'Your Tuesday car commute emits 5.4 kg. The bus saves 80% of that.', saving_kg: 8,  difficulty: 1, category: 'transport' },
  { title: 'Try one meat-free day per week',        description: 'Replacing one beef meal per week can save up to 6 kg CO2 monthly.', saving_kg: 12, difficulty: 1, category: 'diet' },
  { title: 'Switch to LED lighting at home',        description: 'LEDs use 75% less energy than incandescent bulbs.',                 saving_kg: 5,  difficulty: 2, category: 'energy' },
  { title: 'Reduce standby power overnight',        description: 'Plugging out devices at night can save 2-4 kg per month.',          saving_kg: 3,  difficulty: 1, category: 'energy' },
  { title: 'Buy second-hand clothing',              description: 'One second-hand purchase instead of new saves an average of 8 kg.', saving_kg: 8,  difficulty: 2, category: 'shopping' },
];

// =============================================================================
// GET /api/recommendations
// Returns today's (or most recent) recommendations for the user.
// If none exist yet, seeds 3 fallback tips automatically.
// =============================================================================
router.get('/', async (req, res, next) => {
  const uid = req.user.id;
  try {
    let { rows } = await pool.query(
      `SELECT * FROM recommendations
       WHERE user_id = $1
         AND DATE(generated_at) = CURRENT_DATE
         AND is_actioned = FALSE
       ORDER BY saving_kg DESC`,
      [uid]
    );

    // Auto-seed if the user has no recommendations today
    if (rows.length === 0) {
      const tips = FALLBACK_TIPS.slice(0, 3);
      // Bulk INSERT in a single round-trip instead of 3 sequential queries
      await pool.query(
        `INSERT INTO recommendations (user_id, title, description, saving_kg, difficulty, category)
         VALUES
           ($1,$2,$3,$4,$5,$6),
           ($1,$7,$8,$9,$10,$11),
           ($1,$12,$13,$14,$15,$16)`,
        [
          uid,
          tips[0].title, tips[0].description, tips[0].saving_kg, tips[0].difficulty, tips[0].category,
          tips[1].title, tips[1].description, tips[1].saving_kg, tips[1].difficulty, tips[1].category,
          tips[2].title, tips[2].description, tips[2].saving_kg, tips[2].difficulty, tips[2].category,
        ]
      );
      const seeded = await pool.query(
        `SELECT * FROM recommendations WHERE user_id=$1 AND DATE(generated_at)=CURRENT_DATE`,
        [uid]
      );
      rows = seeded.rows;
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// PATCH /api/recommendations/:id
// Body: { action: 'done' | 'skip' }
// =============================================================================
router.patch('/:id', async (req, res, next) => {
  const { action } = req.body;
  if (!['done', 'skip'].includes(action)) {
    return res.status(400).json({ error: "action must be 'done' or 'skip'" });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE recommendations
       SET is_actioned=TRUE, action_type=$1
       WHERE id=$2 AND user_id=$3
       RETURNING *`,
      [action, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Recommendation not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
