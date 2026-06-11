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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage  from './pages/DashboardPage';
import LogActivityPage from './pages/LogActivityPage';
import InsightsPage   from './pages/InsightsPage';
import GoalsPage      from './pages/GoalsPage';
import CommunityPage  from './pages/CommunityPage';
import LearnPage      from './pages/LearnPage';
import { ROUTES }     from './utils/constants';

// =============================================================================
// SECTION: ProtectedRoute
// Redirects unauthenticated users to /login.
// Redirects non-onboarded users away from dashboard pages to /onboarding.
// =============================================================================
function ProtectedRoute({ children, requireOnboarded = false }) {
  const { user, isOnboarded } = useAuth();
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

      {/* --- Catch-all --- */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
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
