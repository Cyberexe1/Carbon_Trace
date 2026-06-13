// =============================================================================
// SECTION: Auth Middleware
// Verifies Firebase ID tokens sent as Bearer tokens from the frontend.
// Uses firebase-admin with projectId-only init — no service account needed
// for token verification. Firebase Admin fetches Google's public keys over
// HTTPS to verify signatures.
// =============================================================================

'use strict';

const admin    = require('firebase-admin');
const { pool } = require('../db/pool');

// Initialise Firebase Admin once.
// For ID token verification only, no service account key file is needed —
// Firebase Admin fetches Google's public keys automatically.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
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
    // Strategy:
    //   1. Try to find existing row by firebase_uid (returning users)
    //   2. If not found, try to find by email (migrated legacy users)
    //   3. If found by email, stamp firebase_uid onto that row
    //   4. If not found at all, insert a new row
    let userRow;

    // First: look up by firebase_uid
    const byUid = await pool.query(
      'SELECT id, first_name, is_onboarded FROM users WHERE firebase_uid = $1',
      [decoded.uid]
    );

    if (byUid.rowCount > 0) {
      // Known Firebase user — just return
      userRow = byUid.rows[0];
    } else {
      // Check if a legacy row exists with this email
      const byEmail = await pool.query(
        'SELECT id, first_name, is_onboarded FROM users WHERE email = $1',
        [decoded.email || '']
      );

      if (byEmail.rowCount > 0) {
        // Migrate: stamp firebase_uid onto the existing row
        const updated = await pool.query(
          `UPDATE users SET firebase_uid = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING id, first_name, is_onboarded`,
          [decoded.uid, byEmail.rows[0].id]
        );
        userRow = updated.rows[0];
      } else {
        // Brand new user — insert
        const inserted = await pool.query(
          `INSERT INTO users (firebase_uid, email, first_name, last_name)
           VALUES ($1, $2, $3, $4)
           RETURNING id, first_name, is_onboarded`,
          [
            decoded.uid,
            decoded.email || '',
            decoded.name?.split(' ')[0] || decoded.email?.split('@')[0] || 'User',
            decoded.name?.split(' ').slice(1).join(' ') || '',
          ]
        );
        userRow = inserted.rows[0];
      }
    }

    req.user = {
      uid:         decoded.uid,
      email:       decoded.email,
      id:          userRow.id,
      firstName:   userRow.first_name,
      isOnboarded: userRow.is_onboarded,
    };

    next();
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    if (err.code === 'auth/argument-error' || err.code === 'auth/invalid-credential') {
      return res.status(401).json({ error: 'Invalid token format. Please log in again.' });
    }
    // Log full error in dev so it's easy to diagnose
    if (process.env.NODE_ENV !== 'production') {
      console.error('[auth] Token verification failed:', err.code, err.message);
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = { requireAuth };
