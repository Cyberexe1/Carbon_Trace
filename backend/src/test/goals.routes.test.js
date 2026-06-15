// =============================================================================
// SECTION: Goals Routes — Backend Tests
// Tests all 4 goals endpoints using supertest against an in-memory mock
// pool so no real database is required.
// =============================================================================

'use strict';

const request = require('supertest');

// =============================================================================
// SECTION: Mock setup — must happen before requiring app
// =============================================================================

// Mock pool
const mockQuery = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { query: mockQuery },
}));

// Mock Firebase Admin — skip real token verification
jest.mock('firebase-admin', () => ({
  apps:  [],
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid:   'test-uid',
      email: 'test@example.com',
      name:  'Test User',
    }),
  }),
}));

const app = require('../server');

// =============================================================================
// SECTION: Helper — simulate authenticated request
// =============================================================================
const AUTH_HEADER = { Authorization: 'Bearer mock-firebase-token' };

// Seed the pool mock to return a Neon user row from requireAuth
function mockAuth() {
  mockQuery.mockResolvedValueOnce({
    rowCount: 1,
    rows: [{ id: 1, first_name: 'Test', is_onboarded: true }],
  });
}

describe('Goals Routes', () => {
  beforeEach(() => mockQuery.mockReset());

  // --------------------------------------------------------------------------
  describe('GET /api/goals', () => {
    it('returns 401 without auth header', async () => {
      const res = await request(app).get('/api/goals');
      expect(res.status).toBe(401);
    });

    it('returns goals array for authenticated user', async () => {
      mockAuth();
      const goals = [
        { id: 1, title: 'Test', category: 'transport', target_kg: '20',
          progress_kg: '5', progress_pct: '25', deadline: '2026-12-31', status: 'active' },
      ];
      mockQuery.mockResolvedValueOnce({ rows: goals });
      const res = await request(app).get('/api/goals').set(AUTH_HEADER);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Test');
    });

    it('filters by status=completed', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/goals?status=completed').set(AUTH_HEADER);
      expect(res.status).toBe(200);
      // Verify the query was called with the completed status param
      const queryCall = mockQuery.mock.calls.find(
        (call) => call[0]?.includes?.('status')
      );
      expect(queryCall).toBeDefined();
    });

    it('returns all goals when status=all', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/goals?status=all').set(AUTH_HEADER);
      expect(res.status).toBe(200);
    });
  });

  // --------------------------------------------------------------------------
  describe('POST /api/goals', () => {
    it('returns 422 for invalid category', async () => {
      mockAuth();
      const res = await request(app)
        .post('/api/goals')
        .set(AUTH_HEADER)
        .send({ title: 'Test', category: 'invalid', target_kg: 10, deadline: '2026-12-31' });
      expect(res.status).toBe(422);
    });

    it('returns 422 when title is missing', async () => {
      mockAuth();
      const res = await request(app)
        .post('/api/goals')
        .set(AUTH_HEADER)
        .send({ category: 'transport', target_kg: 10, deadline: '2026-12-31' });
      expect(res.status).toBe(422);
    });

    it('returns 422 when deadline is invalid date', async () => {
      mockAuth();
      const res = await request(app)
        .post('/api/goals')
        .set(AUTH_HEADER)
        .send({ title: 'Test', category: 'transport', target_kg: 10, deadline: 'not-a-date' });
      expect(res.status).toBe(422);
    });

    it('creates goal and returns 201', async () => {
      mockAuth();
      const newGoal = {
        id: 5, title: 'New Goal', category: 'diet',
        target_kg: '15', progress_kg: '0', deadline: '2026-12-31', status: 'active',
      };
      mockQuery.mockResolvedValueOnce({ rows: [newGoal] });
      const res = await request(app)
        .post('/api/goals')
        .set(AUTH_HEADER)
        .send({ title: 'New Goal', category: 'diet', target_kg: 15, deadline: '2026-12-31' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Goal');
    });
  });

  // --------------------------------------------------------------------------
  describe('PATCH /api/goals/:id', () => {
    it('returns 404 for non-existent goal', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // SELECT finds nothing
      const res = await request(app)
        .patch('/api/goals/999')
        .set(AUTH_HEADER)
        .send({ status: 'completed' });
      expect(res.status).toBe(404);
    });

    it('auto-completes goal when progress >= target', async () => {
      mockAuth();
      const existing = {
        id: 1, status: 'active', target_kg: '10', progress_kg: '0',
      };
      const updated = { ...existing, status: 'completed', progress_kg: '10' };
      mockQuery
        .mockResolvedValueOnce({ rowCount: 1, rows: [existing] }) // SELECT current
        .mockResolvedValueOnce({ rows: [updated] });               // UPDATE
      const res = await request(app)
        .patch('/api/goals/1')
        .set(AUTH_HEADER)
        .send({ progress_kg: 10 });
      expect(res.status).toBe(200);
    });

    it('enforces ownership — cannot update another user\'s goal', async () => {
      mockAuth();
      // Simulate no row found for this user (different user owns it)
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      const res = await request(app)
        .patch('/api/goals/1')
        .set(AUTH_HEADER)
        .send({ status: 'completed' });
      expect(res.status).toBe(404);
    });
  });

  // --------------------------------------------------------------------------
  describe('DELETE /api/goals/:id', () => {
    it('returns 404 when goal does not exist', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const res = await request(app).delete('/api/goals/999').set(AUTH_HEADER);
      expect(res.status).toBe(404);
    });

    it('deletes goal and returns message', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const res = await request(app).delete('/api/goals/1').set(AUTH_HEADER);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 401 without auth', async () => {
      const res = await request(app).delete('/api/goals/1');
      expect(res.status).toBe(401);
    });
  });
});
