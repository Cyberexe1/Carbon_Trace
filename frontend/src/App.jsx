// =============================================================================
// SECTION: App — Root Component
// Full route map:
//   /                    → LandingPage     (public)
//   /login               → LoginPage       (public)
//   /onboarding          → OnboardingPage  (needs login)
//   /dashboard           → DashboardPage   (needs login + onboarded)
//   /dashboard/log       → LogActivityPage (needs login + onboarded)
//   /dashboard/insights  → InsightsPage    (needs login + onboarded)
//   /dashboard/goals     → GoalsPage       (needs login + onboarded)
//   /dashboard/community → CommunityPage   (needs login + onboarded)
//   /dashboard/learn     → LearnPage       (needs login + onboarded)
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useRef }     from 'react';
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage  from './pages/DashboardPage';
import LogActivityPage from './pages/LogActivityPage';
import InsightsPage   from './pages/InsightsPage';
import GoalsPage      from './pages/GoalsPage';
import CommunityPage  from './pages/CommunityPage';
import LearnPage      from './pages/LearnPage';
import SettingsPage   from './pages/SettingsPage';
import { ROUTES }     from './utils/constants';

// =============================================================================
// SECTION: RouteAnnouncer
// Screen readers don't announce SPA route changes automatically.
// This component reads each new page title into a live region so
// keyboard/screen reader users know the page changed.
// =============================================================================
function RouteAnnouncer() {
  const location  = useLocation();
  const regionRef = useRef(null);

  // Map path prefixes to human-readable page names
  const getPageName = (pathname) => {
    if (pathname === ROUTES.HOME)          return 'Home';
    if (pathname === ROUTES.LOGIN)         return 'Sign In';
    if (pathname === ROUTES.ONBOARDING)    return 'Onboarding';
    if (pathname === ROUTES.DASHBOARD)     return 'Dashboard';
    if (pathname === ROUTES.LOG)           return 'Log Activity';
    if (pathname === ROUTES.INSIGHTS)      return 'Insights';
    if (pathname === ROUTES.GOALS)         return 'Goals';
    if (pathname === ROUTES.COMMUNITY)     return 'Community';
    if (pathname === ROUTES.LEARN)         return 'Learn';
    if (pathname === ROUTES.SETTINGS)      return 'Settings';
    return 'Page';
  };

  useEffect(() => {
    if (regionRef.current) {
      // Clear then set — forces re-announcement even for same route
      regionRef.current.textContent = '';
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = `Navigated to ${getPageName(location.pathname)}`;
        }
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div
      ref={regionRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}

// =============================================================================
// SECTION: ProtectedRoute
// Redirects unauthenticated users to /login.
// Redirects non-onboarded users away from dashboard pages to /onboarding.
// Shows nothing while auth state is still loading (avoids flash redirect).
// =============================================================================
function ProtectedRoute({ children, requireOnboarded = false }) {
  const { user, isOnboarded, loading } = useAuth();

  // Still waiting for Firebase + backend to resolve — render nothing
  if (loading) return null;

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (requireOnboarded && !isOnboarded) return <Navigate to={ROUTES.ONBOARDING} replace />;
  return children;
}

// Convenience wrapper for all dashboard-level pages (login + onboarded required)
const P = ({ children }) => <ProtectedRoute requireOnboarded>{children}</ProtectedRoute>;

// =============================================================================
// SECTION: AppRoutes
// =============================================================================
function AppRoutes() {
  return (
    <>
      <RouteAnnouncer />
      <Routes>
        {/* --- Public --- */}
        <Route path={ROUTES.HOME}       element={<LandingPage />} />
        <Route path={ROUTES.LOGIN}      element={<LoginPage />} />

        {/* --- Needs auth only --- */}
        <Route path={ROUTES.ONBOARDING} element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />

        {/* --- Needs auth + onboarded --- */}
        <Route path={ROUTES.DASHBOARD}  element={<P><DashboardPage /></P>} />
        <Route path={ROUTES.LOG}        element={<P><LogActivityPage /></P>} />
        <Route path={ROUTES.INSIGHTS}   element={<P><InsightsPage /></P>} />
        <Route path={ROUTES.GOALS}      element={<P><GoalsPage /></P>} />
        <Route path={ROUTES.COMMUNITY}  element={<P><CommunityPage /></P>} />
        <Route path={ROUTES.LEARN}      element={<P><LearnPage /></P>} />
        <Route path={ROUTES.SETTINGS}   element={<P><SettingsPage /></P>} />

        {/* --- Catch-all --- */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
}

// =============================================================================
// SECTION: App — Default Export
// =============================================================================
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
