// =============================================================================
// SECTION: Auth Middleware
// Verifies the JWT Bearer token on every protected route.
// Attaches the decoded payload to req.user so route handlers can read
// req.user.id without re-querying the database on every request.
// =============================================================================

'use strict';

const jwt = require('jsonwebtoken');

/**
 * requireAuth — Express middleware
 * Expects: Authorization: Bearer <token>
 * On success: sets req.user = { id, email } and calls next()
 * On failure: returns 401 JSON error
 */
function requireAuth(req, res, next) {
  // --- Extract token from Authorization header ---
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  try {
    // --- Verify signature and expiry ---
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    // Distinguish expired vs. tampered tokens for clear client messaging
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = { requireAuth };
