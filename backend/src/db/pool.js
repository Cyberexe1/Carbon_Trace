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
  // Neon requires SSL. In production we validate the cert chain; in local dev
  // we relax it because some local proxies use self-signed certs.
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
  // Connection pool sizing
  max: 10,          // max simultaneous clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log the first successful connection only (avoids 10x noise on pool warm-up)
let connectionLogged = false;
pool.on('connect', () => {
  if (!connectionLogged) {
    console.log('[db] Connected to Neon PostgreSQL');
    connectionLogged = true;
  }
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

module.exports = { pool };
