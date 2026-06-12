'use strict';
require('dotenv').config();
const { pool } = require('./pool');

async function run() {
  try {
    await pool.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE,
        ALTER COLUMN password_hash SET DEFAULT '';
    `);
    console.log('[db] firebase_uid column added, password_hash default set.');
  } catch (err) {
    console.error('[db] Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
