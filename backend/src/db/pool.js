// =============================================================================
// SECTION: Database Pool
// Creates a single pg Pool instance using the Neon connection string from .env.
// SSL is required by Neon — rejectUnauthorized:false is safe for Neon's
// managed TLS certs.
// All other modules import { pool } from here — never create their own Pool.
// =============================================================================

'use strict';

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon uses managed certs — safe to skip chain verify
  },
  // Connection pool sizing
  max: 10,          // max simultaneous clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log successful connection on first acquire
pool.on('connect', () => {
  console.log('[db] Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

module.exports = { pool };
