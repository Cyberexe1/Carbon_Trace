// =============================================================================
// SECTION: API Service — Central HTTP Client
// All calls to the Express backend go through this file.
// Base URL is read from the Vite env variable VITE_API_URL (defaults to
// http://localhost:5000/api so dev works with zero config).
//
// Pattern:
//   Every exported function returns { data, error }.
//   Callers never need to try/catch — they check if (error) instead.
//   This keeps UI components clean and consistent.
// =============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =============================================================================
// SECTION: Core fetch wrapper
// Attaches Authorization header automatically when a token is in localStorage.
// Returns { data } on success, { error } on failure.
// =============================================================================
async function request(method, path, body = null) {
  const token = localStorage.getItem('ct_token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res  = await fetch(`${BASE_URL}${path}`, options);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }

    return { data: json, error: null };
  } catch (err) {
    // Network-level failure (offline, CORS blocked, etc.)
    return { data: null, error: 'Network error — is the server running?' };
  }
}

// Convenience helpers
const get    = (path)        => request('GET',    path);
const post   = (path, body)  => request('POST',   path, body);
const patch  = (path, body)  => request('PATCH',  path, body);
const put    = (path, body)  => request('PUT',    path, body);
const del    = (path)        => request('DELETE', path);

// =============================================================================
// SECTION: Auth API
// =============================================================================
export const authAPI = {
  /**
   * Register a new account.
   * @param {{ firstName, lastName, email, password, country }} body
   * @returns {{ data: { token, user }, error }}
   */
  register: (body) => post('/auth/register', body),

  /**
   * Log in with email + password.
   * @param {{ email, password }} body
   * @returns {{ data: { token, user }, error }}
   */
  login: (body) => post('/auth/login', body),

  /**
   * Fetch the currently authenticated user's profile.
   * @returns {{ data: user, error }}
   */
  me: () => get('/auth/me'),

  /**
   * Complete the onboarding wizard.
   * @param {{ lifestyle }} body
   * @returns {{ data: { message }, error }}
   */
  onboard: (body) => patch('/auth/onboard', body),
};

// =============================================================================
// SECTION: Activities API
// =============================================================================
export const activitiesAPI = {
  /**
   * Fetch paginated activities.
   * @param {{ page?, limit?, category?, date_from?, date_to? }} params
   */
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/activities${qs ? '?' + qs : ''}`);
  },

  /** Summary totals by category for a given period. */
  summary: (period = 'month') => get(`/activities/summary?period=${period}`),

  /** Daily totals for the last N days (sparkline data). */
  trend: (days = 7) => get(`/activities/trend?days=${days}`),

  /** Log a new activity. */
  create: (body) => post('/activities', body),

  /** Update an existing activity. */
  update: (id, body) => put(`/activities/${id}`, body),

  /** Delete an activity. */
  remove: (id) => del(`/activities/${id}`),
};

// =============================================================================
// SECTION: Goals API
// =============================================================================
export const goalsAPI = {
  /** Fetch goals. status = 'active' | 'completed' | 'failed' | 'all' */
  list: (status = 'active') => get(`/goals?status=${status}`),

  /** Create a new goal. */
  create: (body) => post('/goals', body),

  /** Update progress or status. */
  update: (id, body) => patch(`/goals/${id}`, body),

  /** Delete a goal. */
  remove: (id) => del(`/goals/${id}`),
};

// =============================================================================
// SECTION: Challenges API
// =============================================================================
export const challengesAPI = {
  /** List all active challenges with user join status. */
  list: () => get('/challenges'),

  /** Join a challenge. */
  join: (id) => post(`/challenges/${id}/join`),

  /** Get leaderboard for a challenge. */
  leaderboard: (id) => get(`/challenges/${id}/leaderboard`),
};

// =============================================================================
// SECTION: Recommendations API
// =============================================================================
export const recommendationsAPI = {
  /** Fetch today's recommendations (auto-seeded if empty). */
  list: () => get('/recommendations'),

  /** Mark a recommendation as done or skip. */
  action: (id, action) => patch(`/recommendations/${id}`, { action }),
};

// =============================================================================
// SECTION: Users API
// =============================================================================
export const usersAPI = {
  /** Full profile. */
  profile: () => get('/users/profile'),

  /** Update profile fields. */
  updateProfile: (body) => patch('/users/profile', body),

  /** All dashboard aggregates in one request. */
  dashboard: () => get('/users/dashboard'),

  /** Permanently delete the account. */
  deleteAccount: () => del('/users/account'),
};

// =============================================================================
// SECTION: Token helpers
// Called by AuthContext after a successful login/register.
// =============================================================================
export function saveToken(token) {
  localStorage.setItem('ct_token', token);
}

export function clearToken() {
  localStorage.removeItem('ct_token');
}

export function getToken() {
  return localStorage.getItem('ct_token');
}
