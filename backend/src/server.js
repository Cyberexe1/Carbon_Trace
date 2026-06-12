// =============================================================================
// SECTION: Express Server — Entry Point
// Initialises all middleware, mounts routes, and starts the HTTP server.
// Load order matters: security headers → CORS → body parsing →
//   logging → routes → 404 → global error handler
// =============================================================================

'use strict';

require('dotenv').config();

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');

// --- Route modules ---
const authRoutes            = require('./routes/auth.routes');
const activitiesRoutes      = require('./routes/activities.routes');
const goalsRoutes           = require('./routes/goals.routes');
const challengesRoutes      = require('./routes/challenges.routes');
const usersRoutes           = require('./routes/users.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');

// --- Middleware modules ---
const { errorHandler } = require('./middleware/errorHandler');

// =============================================================================
// SECTION: App Setup
// =============================================================================
const app  = express();
const PORT = process.env.PORT || 5000;

// --- Security headers (helmet defaults are sensible) ---
app.use(helmet());

// --- CORS: allow only the frontend origin ---
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Body parsing ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- HTTP request logging (concise in dev, combined in prod) ---
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// =============================================================================
// SECTION: Routes
// All API routes are mounted under /api
// =============================================================================
app.use('/api/auth',            authRoutes);
app.use('/api/activities',      activitiesRoutes);
app.use('/api/goals',           goalsRoutes);
app.use('/api/challenges',      challengesRoutes);
app.use('/api/users',           usersRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// =============================================================================
// SECTION: Health Check
// Simple endpoint for uptime monitoring / load balancer probes.
// =============================================================================
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'carbontrace-api',
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// SECTION: 404 Handler
// Catches any request that didn't match a registered route.
// =============================================================================
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// =============================================================================
// SECTION: Global Error Handler
// Must be last — catches errors passed via next(err) from all routes.
// =============================================================================
app.use(errorHandler);

// =============================================================================
// SECTION: Server Start
// =============================================================================
app.listen(PORT, () => {
  console.log(`[server] CarbonTrace API running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[server] Frontend origin: ${process.env.FRONTEND_URL}`);
});

module.exports = app; // exported for testing
