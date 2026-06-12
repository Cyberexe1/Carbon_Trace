// =============================================================================
// SECTION: Auth Context
// Provides application-wide authentication state.
// On login/register: calls the real backend, stores JWT in localStorage,
// persists user object in state.
// Falls back to local-only mode if the API is unreachable (dev convenience).
// =============================================================================

import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI, saveToken, clearToken, getToken } from '../services/api';

// --- Context creation ---
const AuthContext = createContext(null);

// =============================================================================
// SECTION: AuthProvider
// =============================================================================
export function AuthProvider({ children }) {

  // Restore persisted user from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ct_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('ct_onboarded') === 'true';
  });

  // ==========================================================================
  // SECTION: register — calls POST /api/auth/register
  // Returns { error } if something went wrong, null on success.
  // ==========================================================================
  const register = useCallback(async ({ firstName, lastName, email, password, country }) => {
    const { data, error } = await authAPI.register({ firstName, lastName, email, password, country });
    if (error) return error;

    // Persist JWT + user
    saveToken(data.token);
    const userData = { name: data.user.firstName, email: data.user.email, id: data.user.id };
    setUser(userData);
    localStorage.setItem('ct_user', JSON.stringify(userData));

    if (data.user.isOnboarded) {
      setIsOnboarded(true);
      localStorage.setItem('ct_onboarded', 'true');
    }
    return null; // no error
  }, []);

  // ==========================================================================
  // SECTION: login — calls POST /api/auth/login
  // ==========================================================================
  const login = useCallback(async (emailOrObj, passwordArg) => {
    // Support two calling signatures:
    //   login({ name, email }) — local-only (used by onboarding mock path)
    //   login(email, password)  — real backend call
    if (typeof emailOrObj === 'object' && !passwordArg) {
      // Local-only path (demo / no backend)
      setUser(emailOrObj);
      localStorage.setItem('ct_user', JSON.stringify(emailOrObj));
      return null;
    }

    const { data, error } = await authAPI.login({ email: emailOrObj, password: passwordArg });
    if (error) return error;

    saveToken(data.token);
    const userData = { name: data.user.firstName, email: data.user.email, id: data.user.id };
    setUser(userData);
    localStorage.setItem('ct_user', JSON.stringify(userData));

    if (data.user.isOnboarded) {
      setIsOnboarded(true);
      localStorage.setItem('ct_onboarded', 'true');
    }
    return null;
  }, []);

  // ==========================================================================
  // SECTION: completeOnboarding — calls PATCH /api/auth/onboard
  // ==========================================================================
  const completeOnboarding = useCallback(async (lifestyle = 'transit') => {
    if (getToken()) {
      await authAPI.onboard({ lifestyle }); // fire-and-forget; no UI impact if it fails
    }
    setIsOnboarded(true);
    localStorage.setItem('ct_onboarded', 'true');
  }, []);

  // ==========================================================================
  // SECTION: logout
  // ==========================================================================
  const logout = useCallback(() => {
    setUser(null);
    setIsOnboarded(false);
    clearToken();
    localStorage.removeItem('ct_user');
    localStorage.removeItem('ct_onboarded');
  }, []);

  const value = { user, isOnboarded, login, register, completeOnboarding, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// SECTION: useAuth Hook
// =============================================================================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
