// =============================================================================
// SECTION: SettingsPage Tests
// Tests profile loading, save, export, and delete confirmation flow.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { mockProfile, mockUpdateProfile, mockDeleteAccount } = vi.hoisted(() => ({
  mockProfile:       vi.fn(),
  mockUpdateProfile: vi.fn(),
  mockDeleteAccount: vi.fn(),
}));

vi.mock('../services/api', () => ({
  usersAPI: {
    profile:       mockProfile,
    updateProfile: mockUpdateProfile,
    deleteAccount: mockDeleteAccount,
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user:   { name: 'Test User', email: 'test@test.com' },
    logout: vi.fn().mockResolvedValue(undefined),
    loading: false,
  }),
  AuthProvider: ({ children }) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard/settings' }),
  };
});

vi.mock('../components/layout/DashboardShell', () => ({
  default: ({ children }) => React.createElement('div', { 'data-testid': 'shell' }, children),
}));

import SettingsPage from '../pages/SettingsPage.jsx';

const profileData = {
  id: 1, email: 'test@test.com',
  firstName: 'Jane', lastName: 'Doe',
  country: 'United States', lifestyle: 'transit',
  streak: 5, isOnboarded: true,
};

function wrap() {
  return render(<MemoryRouter><SettingsPage /></MemoryRouter>);
}

describe('SettingsPage', () => {
  beforeEach(() => {
    mockProfile.mockReset();
    mockUpdateProfile.mockReset();
    mockDeleteAccount.mockReset();
    mockNavigate.mockReset();
  });

  it('shows loading skeleton while fetching', () => {
    mockProfile.mockReturnValue(new Promise(() => {}));
    wrap();
    expect(screen.getByRole('status', { name: /loading settings/i })).toHaveAttribute('aria-busy', 'true');
  });

  it('renders page heading', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    });
  });

  it('pre-fills form with loaded profile data', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    });
  });

  it('email field is read-only', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('readonly');
    });
  });

  it('calls updateProfile on save', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    mockUpdateProfile.mockResolvedValue({ data: {}, error: null });
    wrap();
    await waitFor(() => screen.getByLabelText(/first name/i));

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Updated' })
      );
    });
  });

  it('shows success toast after save', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    mockUpdateProfile.mockResolvedValue({ data: {}, error: null });
    wrap();
    await waitFor(() => screen.getByRole('button', { name: /save changes/i }));
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/profile updated/i);
    });
  });

  it('shows delete confirmation when Delete Account clicked', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => screen.getByRole('button', { name: /delete account/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/type delete to confirm/i)).toBeInTheDocument();
    });
  });

  it('Confirm Delete is disabled until DELETE typed', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => screen.getByRole('button', { name: /delete account/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    await waitFor(() => screen.getByLabelText(/type delete to confirm/i));

    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i });
    expect(confirmBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/type delete to confirm/i), { target: { value: 'DELETE' } });
    expect(confirmBtn).not.toBeDisabled();
  });

  it('calls deleteAccount and navigates home on confirm', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    mockDeleteAccount.mockResolvedValue({ data: {}, error: null });
    wrap();
    await waitFor(() => screen.getByRole('button', { name: /delete account/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    await waitFor(() => screen.getByLabelText(/type delete to confirm/i));

    fireEvent.change(screen.getByLabelText(/type delete to confirm/i), { target: { value: 'DELETE' } });
    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('cancel hides delete confirmation', async () => {
    mockProfile.mockResolvedValue({ data: profileData, error: null });
    wrap();
    await waitFor(() => screen.getByRole('button', { name: /delete account/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    await waitFor(() => screen.getByLabelText(/type delete to confirm/i));

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByLabelText(/type delete to confirm/i)).not.toBeInTheDocument();
  });
});
