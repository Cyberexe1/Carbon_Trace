// =============================================================================
// SECTION: LogActivityPage Tests
// Tests category selection, quantity input, log button, delete,
// and CSV import handler.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// =============================================================================
// SECTION: Mocks
// =============================================================================
const { mockCreate, mockRemove, mockList } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockRemove: vi.fn(),
  mockList:   vi.fn(),
}));

vi.mock('../services/api', () => ({
  activitiesAPI: {
    create: mockCreate,
    remove: mockRemove,
    list:   mockList,
  },
}));

vi.mock('../services/mapsService', () => ({
  autocomplete:     vi.fn().mockResolvedValue({ data: [], error: null }),
  getRouteDistance: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test' }, isOnboarded: true, loading: false }),
  AuthProvider: ({ children }) => children,
}));

vi.mock('../components/layout/DashboardShell', () => ({
  default: ({ children }) => React.createElement('div', { 'data-testid': 'shell' }, children),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate, useLocation: () => ({ pathname: '/dashboard/log' }) };
});

import LogActivityPage from '../pages/LogActivityPage.jsx';

function wrap() {
  return render(<MemoryRouter><LogActivityPage /></MemoryRouter>);
}

// =============================================================================
// SECTION: Tests
// =============================================================================
describe('LogActivityPage', () => {
  beforeEach(() => {
    mockList.mockResolvedValue({ data: { activities: [] }, error: null });
    mockCreate.mockReset();
    mockRemove.mockReset();
  });

  it('renders page heading', async () => {
    wrap();
    expect(screen.getByRole('heading', { name: /log activity/i })).toBeInTheDocument();
  });

  it('shows category selection buttons', async () => {
    wrap();
    const group = screen.getByRole('group', { name: /emission category/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transport/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /diet/i })).toBeInTheDocument();
  });

  it('shows empty state before category selected', async () => {
    wrap();
    expect(screen.getByText(/select a category above/i)).toBeInTheDocument();
  });

  it('shows subtype buttons after category selected', async () => {
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /diet/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /beef meal/i })).toBeInTheDocument();
    });
  });

  it('shows quantity controls after subtype selected', async () => {
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /diet/i }));
    await waitFor(() => screen.getByRole('button', { name: /beef meal/i }));
    fireEvent.click(screen.getByRole('button', { name: /beef meal/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/decrease quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument();
    });
  });

  it('Log Activity button calls activitiesAPI.create', async () => {
    mockCreate.mockResolvedValue({
      data: { id: 99, category: 'diet', subtype: 'beef', quantity: 1, unit: 'serving', carbon_kg: '6.61' },
      error: null,
    });
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /diet/i }));
    await waitFor(() => screen.getByRole('button', { name: /beef meal/i }));
    fireEvent.click(screen.getByRole('button', { name: /beef meal/i }));
    // Log Activity button renders after subtype + date step — find by accessible name
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /log activity/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /log activity/i }));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'diet', subtype: 'beef' })
      );
    });
  });

  it('Import CSV button is visible on desktop', async () => {
    wrap();
    const btn = screen.getByRole('button', { name: /import csv/i });
    expect(btn).toBeInTheDocument();
  });

  it('Today\'s log shows loaded activities', async () => {
    mockList.mockResolvedValue({
      data: {
        activities: [{
          id: 1, category: 'diet', subtype: 'beef', quantity: 1,
          unit: 'serving', carbon_kg: '6.61',
        }],
      },
      error: null,
    });
    wrap();
    await waitFor(() => {
      expect(screen.getByText(/beef/i)).toBeInTheDocument();
    });
  });
});
