// =============================================================================
// SECTION: Auth Context
// Provides application-wide authentication state via React Context.
// In a production app this would wrap Firebase Auth; here it uses localStorage
// so the routing flow (Landing → Login → Onboarding → Dashboard) works fully
// without a backend.
// =============================================================================

import { createContext, useContext, useState, useCallback } from 'react';

// --- Context creation ---
const AuthContext = createContext(null);

// =============================================================================
// SECTION: AuthProvider Component
// Wraps the entire app. Children can access auth state via useAuth().
// State shape:
//   user        — null when logged out, object { name, email } when logged in
//   isOnboarded — true once the user has completed the 3-step onboarding
// =============================================================================
export function AuthProvider({ children }) {
  // Restore persisted state from localStorage so page refreshes don't log out
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

  // --- login: called after successful register or sign-in ---
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('ct_user', JSON.stringify(userData));
  }, []);

  // --- completeOnboarding: called at end of onboarding wizard ---
  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    localStorage.setItem('ct_onboarded', 'true');
  }, []);

  // --- logout: clears all persisted state ---
  const logout = useCallback(() => {
    setUser(null);
    setIsOnboarded(false);
    localStorage.removeItem('ct_user');
    localStorage.removeItem('ct_onboarded');
  }, []);

  const value = { user, isOnboarded, login, completeOnboarding, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// SECTION: useAuth Hook
// Convenience hook — throws if used outside of AuthProvider.
// =============================================================================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
