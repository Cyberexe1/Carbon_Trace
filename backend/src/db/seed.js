// =============================================================================
// SECTION: Database Seed Script
// Run once after migration:  node src/db/seed.js
//
// Seeds initial platform-wide challenges so the community page has data.
// Uses ON CONFLICT DO NOTHING so it is safe to re-run without duplicates.
// =============================================================================

'use strict';

require('dotenv').config();
const { pool } = require('./pool');

const CHALLENGES = [
  {
    title:       'June Carbon Challenge',
    description: 'Log every activity this month and hit your daily goal 25+ days. ' +
                 'Compete with the global community to see who can reduce the most.',
    category:    'general',
    start_date:  '2026-06-01',
    end_date:    '2026-06-30',
  },
  {
    title:       'Meatless June',
    description: 'Replace meat with plant-based options for at least 15 days this month. ' +
                 'One less beef meal saves up to 6 kg CO2 per sitting.',
    category:    'diet',
    start_date:  '2026-06-01',
    end_date:    '2026-06-30',
  },
  {
    title:       'Cycle to Work Week',
    description: 'Commute by bike or on foot every day for 5 consecutive days. ' +
                 'Zero emissions and better health — a win on both fronts.',
    category:    'transport',
    start_date:  '2026-06-09',
    end_date:    '2026-06-13',
  },
  {
    title:       'Plastic-Free Week',
    description: 'Avoid all single-use plastic purchases for 7 days. ' +
                 'Bring your own bags, bottles, and containers.',
    category:    'shopping',
    start_date:  '2026-06-16',
    end_date:    '2026-06-22',
  },
  {
    title:       'Energy-Saver July',
    description: 'Cut your home energy use by at least 10% compared to June. ' +
                 'Turn off standby devices and lower your thermostat by 2°C.',
    category:    'energy',
    start_date:  '2026-07-01',
    end_date:    '2026-07-31',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('[seed] Seeding challenges...');

    for (const ch of CHALLENGES) {
      const res = await client.query(
        `INSERT INTO challenges (title, description, category, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING
         RETURNING id, title`,
        [ch.title, ch.description, ch.category, ch.start_date, ch.end_date]
      );
      if (res.rowCount > 0) {
        console.log(`  [seed] ✓ Inserted: "${res.rows[0].title}" (id=${res.rows[0].id})`);
      } else {
        console.log(`  [seed] - Already exists: "${ch.title}"`);
      }
    }

    console.log('[seed] Done.');
  } catch (err) {
    console.error('[seed] ERROR:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
