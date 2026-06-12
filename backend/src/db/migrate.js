// =============================================================================
// SECTION: Database Migration Script
// Run once with:  npm run db:migrate
// Creates all tables if they do not already exist.
// Safe to re-run — uses IF NOT EXISTS on every statement.
//
// Tables:
//   users            — account + profile
//   activities       — carbon log entries per user
//   goals            — reduction goals per user
//   challenges       — platform-wide community challenges
//   challenge_members— join table: user <-> challenge participation
//   recommendations  — AI tips stored per user per day
// =============================================================================

'use strict';

require('dotenv').config();
const { pool } = require('./pool');

const SQL = `
-- =============================================================
-- TABLE: users
-- Stores account credentials and profile preferences.
-- password_hash is bcrypt — plain text is never stored.
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL        PRIMARY KEY,
  firebase_uid  VARCHAR(128)  UNIQUE,              -- Firebase Auth UID (null for legacy rows)
  email         VARCHAR(320)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  DEFAULT '',           -- empty for Firebase-auth users
  first_name    VARCHAR(100)  NOT NULL,
  last_name     VARCHAR(100)  DEFAULT '',
  country       VARCHAR(100)  DEFAULT 'United States',
  lifestyle     VARCHAR(50)   DEFAULT 'transit',
  streak        INTEGER       DEFAULT 0,
  is_onboarded  BOOLEAN       DEFAULT FALSE,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- =============================================================
-- TABLE: activities
-- One row per carbon-producing activity logged by a user.
-- carbon_kg is the pre-calculated emission value stored at write
-- time so the dashboard never has to re-compute it.
-- =============================================================
CREATE TABLE IF NOT EXISTS activities (
  id          SERIAL        PRIMARY KEY,
  user_id     INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category    VARCHAR(50)   NOT NULL,   -- transport | diet | energy | shopping | waste
  subtype     VARCHAR(100)  NOT NULL,   -- e.g. car_petrol | beef | electricity
  quantity    NUMERIC(10,3) NOT NULL CHECK (quantity >= 0),
  unit        VARCHAR(20)   NOT NULL,   -- km | kg | kWh | serving | item ...
  carbon_kg   NUMERIC(10,3) NOT NULL CHECK (carbon_kg >= 0),
  notes       VARCHAR(500)  DEFAULT '',
  logged_date DATE          NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- Index: fast fetch of a user's activities ordered by date
CREATE INDEX IF NOT EXISTS idx_activities_user_date
  ON activities (user_id, logged_date DESC);

-- =============================================================
-- TABLE: goals
-- Reduction goals with target kg, deadline, and live progress.
-- progress_kg is updated by the application layer whenever a
-- matching activity is logged.
-- =============================================================
CREATE TABLE IF NOT EXISTS goals (
  id           SERIAL        PRIMARY KEY,
  user_id      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255)  NOT NULL,
  category     VARCHAR(50)   NOT NULL,
  target_kg    NUMERIC(10,3) NOT NULL CHECK (target_kg > 0),
  progress_kg  NUMERIC(10,3) NOT NULL DEFAULT 0 CHECK (progress_kg >= 0),
  deadline     DATE          NOT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active','completed','failed')),
  created_at   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user
  ON goals (user_id, status);

-- =============================================================
-- TABLE: challenges
-- Platform-wide monthly challenges visible to all users.
-- Created by admins or seeded data — not by regular users.
-- =============================================================
CREATE TABLE IF NOT EXISTS challenges (
  id           SERIAL        PRIMARY KEY,
  title        VARCHAR(255)  NOT NULL,
  description  TEXT          DEFAULT '',
  category     VARCHAR(50)   DEFAULT 'general',
  start_date   DATE          NOT NULL,
  end_date     DATE          NOT NULL,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- =============================================================
-- TABLE: challenge_members
-- Join table: tracks which users have joined which challenges
-- and their cumulative kg saved within that challenge.
-- =============================================================
CREATE TABLE IF NOT EXISTS challenge_members (
  id           SERIAL        PRIMARY KEY,
  challenge_id INTEGER       NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id      INTEGER       NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  score_kg     NUMERIC(10,3) NOT NULL DEFAULT 0,
  joined_at    TIMESTAMPTZ   DEFAULT NOW(),
  UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_members_challenge
  ON challenge_members (challenge_id, score_kg DESC);

-- =============================================================
-- TABLE: recommendations
-- One row per AI-generated tip per user.
-- is_actioned tracks whether the user clicked Done / Skip.
-- =============================================================
CREATE TABLE IF NOT EXISTS recommendations (
  id           SERIAL        PRIMARY KEY,
  user_id      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255)  NOT NULL,
  description  TEXT          DEFAULT '',
  saving_kg    NUMERIC(10,3) DEFAULT 0,
  difficulty   SMALLINT      DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  category     VARCHAR(50)   DEFAULT 'general',
  is_actioned  BOOLEAN       DEFAULT FALSE,
  action_type  VARCHAR(20)   DEFAULT NULL, -- 'done' | 'skip' | null
  generated_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user
  ON recommendations (user_id, generated_at DESC);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('[migrate] Running migrations...');
    await client.query(SQL);
    console.log('[migrate] All tables created or already exist. Done.');
  } catch (err) {
    console.error('[migrate] ERROR:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
