// =============================================================================
// SECTION: Auth Middleware
// Verifies Firebase ID tokens sent as Bearer tokens from the frontend.
// Firebase Admin SDK checks signature + expiry against Google's public keys.
// Attaches decoded token to req.user so route handlers can read
// req.user.uid (Firebase UID) and req.user.email without re-querying DB.
//
// Also resolves the internal Neon user id from the firebase_uid column,
// so all existing route handlers continue to work with req.user.id.
// =============================================================================

'use strict';

const admin  = require('firebase-admin');
const { pool } = require('../db/pool');

// Initialise Firebase Admin once — uses Application Default Credentials
// or the FIREBASE_PROJECT_ID env var for minimal config.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId:  process.env.FIREBASE_PROJECT_ID,
  });
}

/**
 * requireAuth — Express middleware
 * Expects: Authorization: Bearer <firebase-id-token>
 * On success: sets req.user = { uid, email, id } and calls next()
 *   uid  — Firebase UID string
 *   id   — internal Neon users.id integer (auto-created on first request)
 * On failure: returns 401 JSON error
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  try {
    // Verify Firebase ID token — throws if expired or tampered
    const decoded = await admin.auth().verifyIdToken(token);

    // Upsert user into Neon so all FK references work.
    // On first login: inserts a row. On subsequent: returns existing id.
    const { rows } = await pool.query(
      `INSERT INTO users (firebase_uid, email, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (firebase_uid) DO UPDATE
         SET email      = EXCLUDED.email,
             updated_at = NOW()
       RETURNING id, email, first_name, is_onboarded`,
      [
        decoded.uid,
        decoded.email || '',
        decoded.name?.split(' ')[0] || decoded.email?.split('@')[0] || 'User',
        decoded.name?.split(' ').slice(1).join(' ') || '',
      ]
    );

    req.user = {
      uid:         decoded.uid,
      email:       decoded.email,
      id:          rows[0].id,
      firstName:   rows[0].first_name,
      isOnboarded: rows[0].is_onboarded,
    };

    next();
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    console.error('[auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = { requireAuth };
