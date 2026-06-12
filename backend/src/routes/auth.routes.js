// =============================================================================
// SECTION: Auth Routes
// POST /api/auth/register  — create account, return JWT
// POST /api/auth/login     — verify credentials, return JWT
// GET  /api/auth/me        — return current user profile (protected)
// =============================================================================

'use strict';

const express   = require('express');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { body }  = require('express-validator');
const { pool }  = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { validate }    = require('../middleware/validate');

const router = express.Router();

// --- Helper: sign a JWT for a user row ---
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// =============================================================================
// POST /api/auth/register
// Body: { firstName, lastName, email, password, country }
// Returns: { token, user }
// =============================================================================
const registerRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('country').optional().trim(),
];

router.post('/register', registerRules, validate, async (req, res, next) => {
  const { firstName, lastName = '', email, password, country = 'United States' } = req.body;

  try {
    // --- Check for duplicate email ---
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    // --- Hash password (12 rounds — secure but not too slow) ---
    const password_hash = await bcrypt.hash(password, 12);

    // --- Insert new user ---
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, country)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, country, is_onboarded, streak, created_at`,
      [firstName, lastName, email, password_hash, country]
    );

    const user  = result.rows[0];
    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id:          user.id,
        email:       user.email,
        firstName:   user.first_name,
        lastName:    user.last_name,
        country:     user.country,
        isOnboarded: user.is_onboarded,
        streak:      user.streak,
      },
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// POST /api/auth/login
// Body: { email, password }
// Returns: { token, user }
// =============================================================================
const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', loginRules, validate, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // --- Fetch user by email ---
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, country, password_hash,
              is_onboarded, streak
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      // Use identical message for missing user and wrong password (prevents enumeration)
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const user = result.rows[0];

    // --- Compare plaintext vs. stored hash ---
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id:          user.id,
        email:       user.email,
        firstName:   user.first_name,
        lastName:    user.last_name,
        country:     user.country,
        isOnboarded: user.is_onboarded,
        streak:      user.streak,
      },
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// GET /api/auth/me  (protected)
// Returns the currently authenticated user's profile.
// =============================================================================
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, country, lifestyle,
              is_onboarded, streak, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const u = result.rows[0];
    res.json({
      id:          u.id,
      email:       u.email,
      firstName:   u.first_name,
      lastName:    u.last_name,
      country:     u.country,
      lifestyle:   u.lifestyle,
      isOnboarded: u.is_onboarded,
      streak:      u.streak,
      createdAt:   u.created_at,
    });
  } catch (err) {
    next(err);
  }
});

// =============================================================================
// PATCH /api/auth/onboard  (protected)
// Marks the user as having completed the onboarding wizard.
// Body: { lifestyle, concerns[] }
// =============================================================================
router.patch('/onboard', requireAuth, async (req, res, next) => {
  const { lifestyle = 'transit' } = req.body;
  try {
    await pool.query(
      `UPDATE users SET is_onboarded = TRUE, lifestyle = $1, updated_at = NOW()
       WHERE id = $2`,
      [lifestyle, req.user.id]
    );
    res.json({ message: 'Onboarding complete.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
