// =============================================================================
// SECTION: Page-level Component Tests
// Tests GoalsPage and DashboardPage rendering, loading states,
// and key interactions using React Testing Library.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// =============================================================================
// SECTION: Mocks
// =============================================================================

// Mock API modules — use vi.hoisted so variables are available in vi.mock factories
const { mockGoalsList, mockGoalsCreate, mockGoalsUpdate, mockGoalsRemove,
        mockDashboard, mockRecsList, mockTrend } = vi.hoisted(() => ({
  mockGoalsList:   vi.fn(),
  mockGoalsCreate: vi.fn(),
  mockGoalsUpdate: vi.fn(),
  mockGoalsRemove: vi.fn(),
  mockDashboard:   vi.fn(),
  mockRecsList:    vi.fn(),
  mockTrend:       vi.fn(),
}));

vi.mock('../services/api', () => ({
  goalsAPI: {
    list:   mockGoalsList,
    create: mockGoalsCreate,
    update: mockGoalsUpdate,
    remove: mockGoalsRemove,
  },
  usersAPI:           { dashboard: mockDashboard },
  recommendationsAPI: { list: mockRecsList, action: vi.fn() },
  activitiesAPI:      { trend: mockTrend, list: vi.fn().mockResolvedValue({ data: { activities: [] }, error: null }) },
  challengesAPI:      { join: vi.fn() },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user:               { name: 'Test User', email: 'test@test.com' },
    isOnboarded:        true,
    loading:            false,
    logout:             vi.fn(),
    completeOnboarding: vi.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard/goals' }),
  };
});

vi.mock('../components/layout/DashboardShell', () => ({
  default: ({ children }) => React.createElement('div', { 'data-testid': 'shell' }, children),
}));

vi.mock('../components/layout/Sidebar',         () => ({ default: () => null }));
vi.mock('../components/layout/MobileBottomNav', () => ({ default: () => null }));

// Import pages after mocks
import GoalsPage     from '../pages/GoalsPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';

function wrap(Component) {
  return render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  );
}

// =============================================================================
// SECTION: GoalsPage Tests
// =============================================================================
describe('GoalsPage', () => {
  beforeEach(() => {
    mockGoalsList.mockReset();
    mockGoalsCreate.mockReset();
    mockGoalsUpdate.mockReset();
    mockGoalsRemove.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading skeleton while fetching', () => {
    // Never resolves so loading stays true
    mockGoalsList.mockReturnValue(new Promise(() => {}));
    wrap(GoalsPage);
    const skeleton = screen.getByRole('status', { name: /loading goals/i });
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders goals page heading', async () => {
    mockGoalsList.mockResolvedValue({ data: [], error: null });
    wrap(GoalsPage);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^goals$/i })).toBeInTheDocument();
    });
  });

  it('shows empty state when no active goals', async () => {
    mockGoalsList.mockResolvedValue({ data: [], error: null });
    wrap(GoalsPage);
    await waitFor(() => {
      expect(screen.getByText(/no active goals/i)).toBeInTheDocument();
    });
  });

  it('renders active goal cards when goals exist', async () => {
    const mockGoal = {
      id: 1, title: 'Cut transport by 20%', category: 'Transport',
      progress_pct: '50', progress_kg: '10', target_kg: '20',
      deadline: '2026-12-31', status: 'active',
    };
    mockGoalsList
      .mockResolvedValueOnce({ data: [mockGoal], error: null }) // active
      .mockResolvedValueOnce({ data: [],         error: null }); // completed
    wrap(GoalsPage);
    await waitFor(() => {
      expect(screen.getByText('Cut transport by 20%')).toBeInTheDocument();
    });
  });

  it('opens new goal panel when New Goal button clicked', async () => {
    mockGoalsList.mockResolvedValue({ data: [], error: null });
    wrap(GoalsPage);
    await waitFor(() => screen.getByText(/no active goals/i));

    fireEvent.click(screen.getAllByRole('button', { name: /new goal/i })[0]);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create a new goal/i })).toBeInTheDocument();
    });
  });

  it('shows title required error on empty goal submit', async () => {
    mockGoalsList.mockResolvedValue({ data: [], error: null });
    wrap(GoalsPage);
    await waitFor(() => screen.getByText(/no active goals/i));

    fireEvent.click(screen.getAllByRole('button', { name: /new goal/i })[0]);
    await waitFor(() => screen.getByRole('dialog'));

    fireEvent.click(screen.getByRole('button', { name: /set goal/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Title is required.');
    });
  });

  it('shows summary counts', async () => {
    const mockGoal = {
      id: 1, title: 'Test goal', category: 'Energy',
      progress_pct: '0', progress_kg: '0', target_kg: '10',
      deadline: '2026-12-31', status: 'active',
    };
    mockGoalsList
      .mockResolvedValueOnce({ data: [mockGoal], error: null })
      .mockResolvedValueOnce({ data: [],         error: null });
    wrap(GoalsPage);
    await waitFor(() => screen.getByText('Test goal'));
    // Active count = 1
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});

// =============================================================================
// SECTION: DashboardPage Tests
// =============================================================================
describe('DashboardPage', () => {
  beforeEach(() => {
    mockDashboard.mockReset();
    mockRecsList.mockReset();
    mockTrend.mockReset();
  });

  it('shows loading skeleton while fetching', () => {
    mockDashboard.mockReturnValue(new Promise(() => {}));
    mockRecsList.mockReturnValue(new Promise(() => {}));
    mockTrend.mockReturnValue(new Promise(() => {}));
    wrap(DashboardPage);
    const skeleton = screen.getByRole('status', { name: /loading dashboard/i });
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders greeting after load', async () => {
    mockDashboard.mockResolvedValue({
      data: { todayKg: 0, streak: 0, weekCategories: [], recentActivities: [], activeGoals: 0 },
      error: null,
    });
    mockRecsList.mockResolvedValue({ data: [], error: null });
    mockTrend.mockResolvedValue({ data: { trend: [] }, error: null });
    wrap(DashboardPage);
    await waitFor(() => {
      expect(screen.getByText(/test user/i)).toBeInTheDocument();
    });
  });

  it('shows real todayKg in hero score', async () => {
    mockDashboard.mockResolvedValue({
      data: { todayKg: 7.5, streak: 3, weekCategories: [], recentActivities: [], activeGoals: 2 },
      error: null,
    });
    mockRecsList.mockResolvedValue({ data: [], error: null });
    mockTrend.mockResolvedValue({ data: { trend: [] }, error: null });
    wrap(DashboardPage);
    await waitFor(() => {
      expect(screen.getByText('7.5')).toBeInTheDocument();
    });
  });

  it('shows error banner when API fails', async () => {
    mockDashboard.mockResolvedValue({ data: null, error: 'Network error — is the server running?' });
    mockRecsList.mockResolvedValue({ data: [], error: null });
    mockTrend.mockResolvedValue({ data: { trend: [] }, error: null });
    wrap(DashboardPage);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('shows streak badge when streak > 0', async () => {
    mockDashboard.mockResolvedValue({
      data: { todayKg: 3, streak: 7, weekCategories: [], recentActivities: [], activeGoals: 0 },
      error: null,
    });
    mockRecsList.mockResolvedValue({ data: [], error: null });
    mockTrend.mockResolvedValue({ data: { trend: [] }, error: null });
    wrap(DashboardPage);
    await waitFor(() => {
      expect(screen.getByText(/7 day/i)).toBeInTheDocument();
    });
  });

  it('shows no activities empty state', async () => {
    mockDashboard.mockResolvedValue({
      data: { todayKg: 0, streak: 0, weekCategories: [], recentActivities: [], activeGoals: 0 },
      error: null,
    });
    mockRecsList.mockResolvedValue({ data: [], error: null });
    mockTrend.mockResolvedValue({ data: { trend: [] }, error: null });
    wrap(DashboardPage);
    await waitFor(() => {
      expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
    });
  });
});
