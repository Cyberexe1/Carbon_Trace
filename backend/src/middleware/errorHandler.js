// =============================================================================
// SECTION: Global Error Handler Middleware
// Catches any error passed via next(err) and returns a consistent JSON shape.
// Masks internal details in production so stack traces never reach the client.
// Must be registered LAST in the Express middleware chain.
// =============================================================================

'use strict';

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log full error server-side for debugging — only for unexpected 5xx
  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.path} →`, err.message);
  }

  // Determine HTTP status
  const status = err.status || err.statusCode || 500;

  // Mask stack trace in production
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'An unexpected error occurred. Please try again.'
      : err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
