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
    const { rows } = await pool.query(
      `SELECT
         c.id, c.title, c.description, c.category,
         c.start_date, c.end_date,
         (SELECT COUNT(*) FROM challenge_members WHERE challenge_id = c.id) AS participant_count,
         (SELECT ROUND(AVG(score_kg)::numeric,1) FROM challenge_members WHERE challenge_id = c.id) AS avg_score_kg,
         EXISTS (
           SELECT 1 FROM challenge_members
           WHERE challenge_id = c.id AND user_id = $1
         ) AS joined,
         (SELECT score_kg FROM challenge_members
          WHERE challenge_id = c.id AND user_id = $1) AS my_score_kg
       FROM challenges c
       WHERE c.end_date >= CURRENT_DATE
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
    const { rows } = await pool.query(
      `SELECT
         cm.user_id,
         u.first_name,
         ROUND(cm.score_kg::numeric, 2) AS score_kg,
         ROW_NUMBER() OVER (ORDER BY cm.score_kg DESC) AS rank
       FROM challenge_members cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.challenge_id = $1
       ORDER BY cm.score_kg DESC
       LIMIT 20`,
      [req.params.id]
    );

    // Also find current user's rank even if outside top 20
    const myRankRow = await pool.query(
      `SELECT rank FROM (
         SELECT user_id, ROW_NUMBER() OVER (ORDER BY score_kg DESC) AS rank
         FROM challenge_members WHERE challenge_id = $1
       ) ranked WHERE user_id = $2`,
      [req.params.id, userId]
    );

    res.json({
      leaderboard: rows,
      myRank:      myRankRow.rows[0]?.rank || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
