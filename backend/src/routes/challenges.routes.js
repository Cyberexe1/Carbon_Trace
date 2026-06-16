// =============================================================================
// SECTION: Challenges Routes
// All routes are protected.
//
// GET  /api/challenges              — list all active challenges + user join status
// POST /api/challenges/:id/join     — join a challenge
// GET  /api/challenges/:id/leaderboard — top 20 participants by score_kg
// =============================================================================

'use strict';

const express = require('express');
const { pool } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// =============================================================================
// GET /api/challenges
// Returns all challenges with a 'joined' flag for the current user.
// =============================================================================
router.get('/', async (req, res, next) => {
  const userId = req.user.id;
  try {
    // Single JOIN replaces 4 correlated subqueries per challenge row.
    // Aggregate stats (count, avg) computed once via GROUP BY;
    // user-specific fields (joined, my_score_kg) extracted with conditional aggregation.
    const { rows } = await pool.query(
      `SELECT
         c.id, c.title, c.description, c.category,
         c.start_date, c.end_date,
         COUNT(cm.user_id)                                         AS participant_count,
         ROUND(AVG(cm.score_kg)::numeric, 1)                       AS avg_score_kg,
         BOOL_OR(cm.user_id = $1)                                  AS joined,
         MAX(CASE WHEN cm.user_id = $1 THEN cm.score_kg END)       AS my_score_kg
       FROM challenges c
       LEFT JOIN challenge_members cm ON cm.challenge_id = c.id
       WHERE c.end_date >= CURRENT_DATE
       GROUP BY c.id, c.title, c.description, c.category, c.start_date, c.end_date
       ORDER BY c.start_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// POST /api/challenges/:id/join
// Adds the authenticated user to a challenge.
// =============================================================================
router.post('/:id/join', async (req, res, next) => {
  try {
    // Verify challenge exists
    const challenge = await pool.query('SELECT id FROM challenges WHERE id = $1', [req.params.id]);
    if (challenge.rowCount === 0) return res.status(404).json({ error: 'Challenge not found.' });

    // Insert or ignore duplicate join
    await pool.query(
      `INSERT INTO challenge_members (challenge_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (challenge_id, user_id) DO NOTHING`,
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Joined challenge.' });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// GET /api/challenges/:id/leaderboard
// Returns top 20 participants for a challenge ordered by score_kg desc.
// =============================================================================
router.get('/:id/leaderboard', async (req, res, next) => {
  const userId = req.user.id;
  try {
    // Single query: CTE ranks all participants, then we pull the top 20
    // and the current user's rank in one round-trip.
    const { rows } = await pool.query(
      `WITH ranked AS (
         SELECT
           cm.user_id,
           u.first_name,
           ROUND(cm.score_kg::numeric, 2) AS score_kg,
           ROW_NUMBER() OVER (ORDER BY cm.score_kg DESC) AS rank
         FROM challenge_members cm
         JOIN users u ON u.id = cm.user_id
         WHERE cm.challenge_id = $1
       )
       SELECT
         user_id,
         first_name,
         score_kg,
         rank,
         rank <= 20 AS in_top20
       FROM ranked
       WHERE rank <= 20 OR user_id = $2
       ORDER BY rank ASC`,
      [req.params.id, userId]
    );

    const leaderboard = rows.filter((r) => r.in_top20);
    const myRankRow   = rows.find((r) => String(r.user_id) === String(userId));

    res.json({
      leaderboard,
      myRank: myRankRow?.rank || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
