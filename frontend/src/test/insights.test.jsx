// =============================================================================
// SECTION: InsightsPage Tests
// Tests loading states, real data rendering, and period switching.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { mockTrend, mockSummary } = vi.hoisted(() => ({
  mockTrend:   vi.fn(),
  mockSummary: vi.fn(),
}));

vi.mock('../services/api', () => ({
  activitiesAPI: {
    trend:   mockTrend,
    summary: mockSummary,
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test' }, loading: false }),
  AuthProvider: ({ children }) => children,
}));

vi.mock('../components/layout/DashboardShell', () => ({
  default: ({ children }) => React.createElement('div', { 'data-testid': 'shell' }, children),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useLocation: () => ({ pathname: '/dashboard/insights' }) };
});

import InsightsPage from '../pages/InsightsPage.jsx';

function wrap() {
  return render(<MemoryRouter><InsightsPage /></MemoryRouter>);
}

const emptySummary = { totalKg: 0, categories: [], period: 'week' };
const emptyTrend   = { trend: [] };

describe('InsightsPage', () => {
  beforeEach(() => {
    mockTrend.mockReset();
    mockSummary.mockReset();
  });

  it('renders page heading', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    expect(screen.getByRole('heading', { name: /^insights$/i })).toBeInTheDocument();
  });

  it('shows loading skeleton while fetching', () => {
    mockTrend.mockReturnValue(new Promise(() => {}));
    mockSummary.mockReturnValue(new Promise(() => {}));
    wrap();
    const skeleton = screen.getByRole('status', { name: /loading chart/i });
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('shows empty state when no data', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    await waitFor(() => {
      expect(screen.getByText(/no activity data/i)).toBeInTheDocument();
    });
  });

  it('shows summary stats after load', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({
      data: {
        totalKg: 42.5,
        period: 'week',
        categories: [{ category: 'transport', total_kg: '30', activity_count: '5' }],
      },
      error: null,
    });
    wrap();
    await waitFor(() => {
      expect(screen.getByText(/42\.5 kg/i)).toBeInTheDocument();
    });
  });

  it('renders period toggle tabs', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    expect(screen.getByRole('tab', { name: /week/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /month/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /year/i })).toBeInTheDocument();
  });

  it('switching period tab triggers new API calls', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    await waitFor(() => screen.getByRole('tab', { name: /month/i }));

    fireEvent.click(screen.getByRole('tab', { name: /month/i }));
    await waitFor(() => {
      // trend called twice: once on mount (week) + once for month
      expect(mockTrend.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows chart when trend data available', async () => {
    mockTrend.mockResolvedValue({
      data: { trend: [
        { date: '2026-06-10', total_kg: '3.5' },
        { date: '2026-06-11', total_kg: '5.2' },
      ]},
      error: null,
    });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    await waitFor(() => {
      // Chart renders with accessible table
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('shows Reduction Opportunities section', async () => {
    mockTrend.mockResolvedValue({ data: emptyTrend, error: null });
    mockSummary.mockResolvedValue({ data: emptySummary, error: null });
    wrap();
    await waitFor(() => {
      expect(screen.getByText(/reduction opportunities/i)).toBeInTheDocument();
    });
  });
});
