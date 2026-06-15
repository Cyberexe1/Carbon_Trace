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

// Trust the first proxy hop (Nginx / Render / Railway etc.)
// Required for express-rate-limit to use the real client IP.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// --- Security headers ---
// Remove unsafe-inline from scriptSrc in production — only allow in dev for Vite HMR
const isProd = process.env.NODE_ENV === 'production';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  isProd ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: [
        "'self'",
        'https://*.googleapis.com',
        'https://*.neon.tech',
        'https://firebaseinstallations.googleapis.com',
        'https://identitytoolkit.googleapis.com',
        process.env.FRONTEND_URL || 'http://localhost:5173',
      ],
      frameSrc:  ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProd ? [] : null,
    },
  },
}));

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
// SECTION: Rate Limiting
// Prevents brute-force and abuse on all API routes.
// Auth endpoints are stricter — 20 req/15min vs 200 req/15min for API.
// =============================================================================
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many requests. Please try again in 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              20,              // Stricter for auth endpoints
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many auth attempts. Please try again in 15 minutes.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

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
// Only bind to port when running directly — not when imported by tests.
// =============================================================================
if (require.main === module || process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server] CarbonTrace API running on http://localhost:${PORT}`);
    console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[server] Frontend origin: ${process.env.FRONTEND_URL}`);
  });
}

module.exports = app; // exported for testing
