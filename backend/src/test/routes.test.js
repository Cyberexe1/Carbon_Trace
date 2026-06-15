// =============================================================================
// SECTION: Backend Route Tests
// Tests Express routes for activities and goals using supertest.
// Mocks Firebase Admin and the DB pool so tests run without live services.
//
// Focus: ownership isolation — user A cannot access user B's data.
// =============================================================================

'use strict';

const request = require('supertest');
const app     = require('../server');

// =============================================================================
// SECTION: Mock Firebase Admin
// =============================================================================
jest.mock('firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn().mockResolvedValue({
      uid:   'test-uid-123',
      email: 'test@example.com',
      name:  'Test User',
    }),
  };
  return {
    apps:        [],
    initializeApp: jest.fn(),
    auth:        () => mockAuth,
    credential:  { applicationDefault: jest.fn() },
  };
});

// =============================================================================
// SECTION: Mock DB Pool
// =============================================================================
const mockQuery = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { query: jest.fn() },
}));

// Get the mock after the module is loaded
const { pool } = require('../db/pool');

// Helper: mock the 3-step user upsert in requireAuth
function mockUserUpsert(userId = 1) {
  // Step 1: byUid query returns a row
  pool.query.mockResolvedValueOnce({
    rowCount: 1,
    rows: [{ id: userId, first_name: 'Test', is_onboarded: true }],
  });
}

const BEARER = 'Bearer test-firebase-token';

// =============================================================================
// SECTION: Activities Routes
// =============================================================================
describe('GET /api/activities', () => {
  beforeEach(() => pool.query.mockReset());

  it('requires auth — 401 without token', async () => {
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(401);
  });

  it('returns activities for authenticated user', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rows: [
      { id: 1, category: 'diet', subtype: 'beef', quantity: 1, unit: 'serving', carbon_kg: '6.61', logged_date: '2026-06-13' },
    ]});
    pool.query.mockResolvedValueOnce({ rows: [{ count: '1' }] });

    const res = await request(app)
      .get('/api/activities')
      .set('Authorization', BEARER);

    expect(res.status).toBe(200);
    expect(res.body.activities).toHaveLength(1);
    expect(res.body.activities[0].category).toBe('diet');
  });
});

describe('POST /api/activities', () => {
  beforeEach(() => pool.query.mockReset());

  it('rejects invalid category with 422', async () => {
    mockUserUpsert(1);
    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', BEARER)
      .send({ category: 'invalid', subtype: 'test', quantity: 1, unit: 'kg', carbon_kg: 1 });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('creates activity for authenticated user', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rows: [{
      id: 99, category: 'transport', subtype: 'bus',
      quantity: 10, unit: 'km', carbon_kg: '0.89',
    }]});

    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', BEARER)
      .send({ category: 'transport', subtype: 'bus', quantity: 10, unit: 'km', carbon_kg: 0.89 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(99);
  });
});

describe('DELETE /api/activities/:id — ownership isolation', () => {
  beforeEach(() => pool.query.mockReset());

  it('returns 404 when activity belongs to different user', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .delete('/api/activities/999')
      .set('Authorization', BEARER);

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });

  it('deletes own activity successfully', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .delete('/api/activities/1')
      .set('Authorization', BEARER);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});

// =============================================================================
// SECTION: Goals Routes
// =============================================================================
describe('GET /api/goals', () => {
  beforeEach(() => pool.query.mockReset());

  it('requires auth', async () => {
    const res = await request(app).get('/api/goals');
    expect(res.status).toBe(401);
  });

  it('returns goals for authenticated user', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rows: [
      { id: 1, title: 'Test Goal', category: 'transport', target_kg: '20', progress_pct: '0', status: 'active' },
    ]});

    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', BEARER);

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Test Goal');
  });
});

describe('PATCH /api/goals/:id — validation', () => {
  beforeEach(() => pool.query.mockReset());

  it('rejects invalid status value with 422', async () => {
    mockUserUpsert(1);
    const res = await request(app)
      .patch('/api/goals/1')
      .set('Authorization', BEARER)
      .send({ status: 'invalid-status' });
    expect(res.status).toBe(422);
  });

  it('rejects negative progress_kg with 422', async () => {
    mockUserUpsert(1);
    const res = await request(app)
      .patch('/api/goals/1')
      .set('Authorization', BEARER)
      .send({ progress_kg: -5 });
    expect(res.status).toBe(422);
  });

  it('accepts valid status update', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{
      id: 1, progress_kg: '10', target_kg: '20', status: 'active',
    }]});
    pool.query.mockResolvedValueOnce({ rows: [{
      id: 1, progress_kg: '10', target_kg: '20', status: 'completed',
    }]});

    const res = await request(app)
      .patch('/api/goals/1')
      .set('Authorization', BEARER)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });
});

describe('DELETE /api/goals/:id — ownership isolation', () => {
  beforeEach(() => pool.query.mockReset());

  it('returns 404 for goal owned by different user', async () => {
    mockUserUpsert(1);
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .delete('/api/goals/999')
      .set('Authorization', BEARER);

    expect(res.status).toBe(404);
  });
});

// =============================================================================
// SECTION: Health Check
// =============================================================================
describe('GET /health', () => {
  it('returns ok status without auth', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
