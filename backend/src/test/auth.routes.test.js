// =============================================================================
// SECTION: Auth Routes — Backend Tests
// Tests /api/auth/me, /api/auth/onboard with mocked Firebase Admin + pool.
// The legacy register/login routes are not tested since Firebase handles auth.
// =============================================================================

'use strict';

const request = require('supertest');

// Mock pool
const mockQuery = jest.fn();
jest.mock('../db/pool', () => ({
  pool: { query: mockQuery },
}));

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid:   'firebase-uid-123',
      email: 'user@example.com',
      name:  'Jane Doe',
    }),
  }),
}));

const app = require('../server');

const AUTH = { Authorization: 'Bearer mock-token' };

function mockAuth() {
  mockQuery.mockResolvedValueOnce({
    rowCount: 1,
    rows: [{ id: 7, first_name: 'Jane', is_onboarded: true }],
  });
}

describe('Auth Routes', () => {
  beforeEach(() => mockQuery.mockReset());

  // --------------------------------------------------------------------------
  describe('GET /api/auth/me', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns user profile when authenticated', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{
          id: 7, email: 'user@example.com',
          first_name: 'Jane', last_name: 'Doe',
          country: 'Germany', lifestyle: 'transit',
          is_onboarded: true, streak: 5, created_at: new Date().toISOString(),
        }],
      });
      const res = await request(app).get('/api/auth/me').set(AUTH);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('user@example.com');
      expect(res.body.firstName).toBe('Jane');
      expect(res.body.isOnboarded).toBe(true);
      expect(res.body.streak).toBe(5);
    });

    it('returns 404 when user not found in DB', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      const res = await request(app).get('/api/auth/me').set(AUTH);
      expect(res.status).toBe(404);
    });

    it('does not expose password_hash in response', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{
          id: 7, email: 'user@example.com', first_name: 'Jane',
          last_name: '', country: 'US', lifestyle: 'car',
          is_onboarded: true, streak: 0, created_at: new Date().toISOString(),
          password_hash: '$2b$12$secret',
        }],
      });
      const res = await request(app).get('/api/auth/me').set(AUTH);
      expect(res.status).toBe(200);
      expect(res.body.password_hash).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  describe('PATCH /api/auth/onboard', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).patch('/api/auth/onboard').send({ lifestyle: 'car' });
      expect(res.status).toBe(401);
    });

    it('marks user as onboarded', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // UPDATE
      const res = await request(app)
        .patch('/api/auth/onboard')
        .set(AUTH)
        .send({ lifestyle: 'car' });
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/onboarding/i);
    });

    it('uses transit as default lifestyle if not provided', async () => {
      mockAuth();
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const res = await request(app)
        .patch('/api/auth/onboard')
        .set(AUTH)
        .send({});
      expect(res.status).toBe(200);
      // The UPDATE query params are [lifestyle, user_id] = ['transit', 1]
      const updateCall = mockQuery.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].includes('is_onboarded = TRUE')
      );
      expect(updateCall).toBeDefined();
      expect(updateCall[1][0]).toBe('transit'); // $1 = lifestyle
    });
  });

  // --------------------------------------------------------------------------
  describe('Health check', () => {
    it('GET /health returns ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
