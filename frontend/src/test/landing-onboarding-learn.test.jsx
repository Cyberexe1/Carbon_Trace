// =============================================================================
// SECTION: LandingPage, OnboardingPage, LearnPage Tests
// Covers rendering, navigation, interactions, and accessibility attributes.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// =============================================================================
// SECTION: Shared Mocks
// =============================================================================
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user:               { name: 'Jane', email: 'jane@test.com' },
    isOnboarded:        false,
    loading:            false,
    logout:             vi.fn(),
    completeOnboarding: vi.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

vi.mock('../components/layout/Navbar', () => ({
  default: () => React.createElement('nav', { 'data-testid': 'navbar' }, 'Navbar'),
}));

vi.mock('../components/layout/DashboardShell', () => ({
  default: ({ children }) => React.createElement('div', { 'data-testid': 'shell' }, children),
}));

function wrap(Component) {
  return render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  );
}

// =============================================================================
// SECTION: LandingPage Tests
// =============================================================================
import LandingPage from '../pages/LandingPage.jsx';

describe('LandingPage', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('renders the hero heading', () => {
    wrap(LandingPage);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/see your carbon footprint/i)).toBeInTheDocument();
  });

  it('renders the navbar', () => {
    wrap(LandingPage);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the How It Works section', () => {
    wrap(LandingPage);
    expect(screen.getByText(/shrinking your footprint is simple/i)).toBeInTheDocument();
    expect(screen.getByText('Log Activity')).toBeInTheDocument();
    expect(screen.getByText('See Impact')).toBeInTheDocument();
    expect(screen.getByText('Take Action')).toBeInTheDocument();
  });

  it('renders all 6 feature cards', () => {
    wrap(LandingPage);
    expect(screen.getByText('Activity Logging')).toBeInTheDocument();
    expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Score')).toBeInTheDocument();
    expect(screen.getByText('Goal Tracking')).toBeInTheDocument();
    expect(screen.getByText('Community Challenges')).toBeInTheDocument();
    expect(screen.getByText('Education Hub')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    wrap(LandingPage);
    expect(screen.getByText(/real people, real reduction/i)).toBeInTheDocument();
    expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
    expect(screen.getByText('Marcus Thorne')).toBeInTheDocument();
    expect(screen.getByText('Leila Khan')).toBeInTheDocument();
  });

  it('renders social proof company names', () => {
    wrap(LandingPage);
    expect(screen.getByText('ECO-CORP')).toBeInTheDocument();
    expect(screen.getByText('GREEN-LOGIC')).toBeInTheDocument();
  });

  it('Start Your Profile button navigates to login', () => {
    wrap(LandingPage);
    fireEvent.click(screen.getByRole('button', { name: /start your profile/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('Get Started Free button navigates to login', () => {
    wrap(LandingPage);
    fireEvent.click(screen.getByRole('button', { name: /get started free/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('hero section has correct aria-labelledby', () => {
    wrap(LandingPage);
    const section = document.querySelector('section[aria-labelledby="hero-heading"]');
    expect(section).toBeInTheDocument();
  });

  it('renders the footer with copyright', () => {
    wrap(LandingPage);
    expect(screen.getByText(/© 2026 CarbonTrace/i)).toBeInTheDocument();
  });

  it('donut chart has aria-label for accessibility', () => {
    wrap(LandingPage);
    expect(screen.getByRole('img', { name: /donut chart/i })).toBeInTheDocument();
  });

  it('visualization section shows category breakdown', () => {
    wrap(LandingPage);
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
});

// =============================================================================
// SECTION: OnboardingPage Tests
// =============================================================================
import OnboardingPage from '../pages/OnboardingPage.jsx';

describe('OnboardingPage', () => {
  beforeEach(() => mockNavigate.mockReset());

  it('renders step 1 heading by default', () => {
    wrap(OnboardingPage);
    expect(screen.getByRole('heading', { name: /build your eco-profile/i })).toBeInTheDocument();
  });

  it('renders progress bar at step 1 of 3', () => {
    wrap(OnboardingPage);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '33');
    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
  });

  it('renders all 4 lifestyle option buttons', () => {
    wrap(OnboardingPage);
    expect(screen.getByRole('button', { name: /car owner/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /public transit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cyclist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /frequent flyer/i })).toBeInTheDocument();
  });

  it('selecting a lifestyle marks it as pressed', () => {
    wrap(OnboardingPage);
    const carBtn = screen.getByRole('button', { name: /car owner/i });
    expect(carBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(carBtn);
    expect(carBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('Next button advances to step 2', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /what drives your impact/i })).toBeInTheDocument();
    });
  });

  it('Back button is hidden on step 1', () => {
    wrap(OnboardingPage);
    // Back button has aria-hidden="true" and opacity-0 on step 1 — not accessible by role
    const backBtn = screen.getByText('Back').closest('button');
    expect(backBtn).toHaveAttribute('aria-hidden', 'true');
    expect(backBtn).toHaveClass('opacity-0');
  });

  it('Back button is visible on step 2', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    const backBtn = screen.getByRole('button', { name: /back/i });
    expect(backBtn).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('step 2 renders concern option buttons', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    expect(screen.getByRole('button', { name: /transport/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /food/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /energy/i })).toBeInTheDocument();
  });

  it('toggles concern selection on/off', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));

    const transportBtn = screen.getByRole('button', { name: /transport/i });
    fireEvent.click(transportBtn);
    expect(transportBtn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(transportBtn);
    expect(transportBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('advances to step 3 showing the goal card', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /suggested first goal/i })).toBeInTheDocument();
    });
  });

  it('step 3 shows Fresh Start Protocol card', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /suggested first goal/i }));
    expect(screen.getByText(/fresh start/i)).toBeInTheDocument();
    expect(screen.getByText(/-20%/)).toBeInTheDocument();
  });

  it('step 3 shows Begin Journey button', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /suggested first goal/i }));
    expect(screen.getByRole('button', { name: /begin journey/i })).toBeInTheDocument();
  });

  it('progress bar updates on step 2', async () => {
    wrap(OnboardingPage);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => screen.getByRole('heading', { name: /what drives your impact/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '67');
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
  });

  it('dialog has correct aria attributes', () => {
    wrap(OnboardingPage);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'CarbonTrace onboarding');
  });
});

// =============================================================================
// SECTION: LearnPage Tests
// =============================================================================
import LearnPage from '../pages/LearnPage.jsx';

describe('LearnPage', () => {
  it('renders the Learn heading', () => {
    wrap(LearnPage);
    expect(screen.getByRole('heading', { name: /^learn$/i })).toBeInTheDocument();
  });

  it('renders the tab list with 4 tabs', () => {
    wrap(LearnPage);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
  });

  it('Articles tab is selected by default', () => {
    wrap(LearnPage);
    const articlesTab = screen.getByRole('tab', { name: /articles/i });
    expect(articlesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders featured article in Articles tab', () => {
    wrap(LearnPage);
    // First article is featured
    expect(screen.getByText(/carbon intensity changes every hour/i)).toBeInTheDocument();
  });

  it('switching to Videos tab shows video cards', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('tab', { name: /videos/i }));
    await waitFor(() => {
      expect(screen.getByText(/how does the carbon cycle work/i)).toBeInTheDocument();
    });
  });

  it('switching to Glossary tab shows search input', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('tab', { name: /glossary/i }));
    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: /search glossary/i })).toBeInTheDocument();
    });
  });

  it('glossary search filters terms', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('tab', { name: /glossary/i }));
    await waitFor(() => screen.getByRole('searchbox', { name: /search glossary/i }));

    fireEvent.change(screen.getByRole('searchbox', { name: /search glossary/i }), {
      target: { value: 'net zero' },
    });
    await waitFor(() => {
      expect(screen.getByText('Net Zero')).toBeInTheDocument();
      expect(screen.queryByText('Carbon Footprint')).not.toBeInTheDocument();
    });
  });

  it('switching to Myth vs Fact tab shows myth cards', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('tab', { name: /myth vs fact/i }));
    await waitFor(() => {
      expect(screen.getAllByText('MYTH').length).toBeGreaterThan(0);
    });
  });

  it('clicking a myth card flips to show fact', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('tab', { name: /myth vs fact/i }));
    await waitFor(() => screen.getAllByText('MYTH'));

    const firstCard = screen.getAllByRole('button', { name: /reveal fact/i })[0];
    fireEvent.click(firstCard);
    await waitFor(() => {
      expect(screen.getByText('FACT')).toBeInTheDocument();
    });
  });

  it('articles category filter chips render', () => {
    wrap(LearnPage);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Energy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Diet' })).toBeInTheDocument();
  });

  it('filtering articles by category shows only matching cards', async () => {
    wrap(LearnPage);
    fireEvent.click(screen.getByRole('button', { name: 'Diet' }));
    await waitFor(() => {
      expect(screen.getByText(/real carbon cost of a beef burger/i)).toBeInTheDocument();
      expect(screen.queryByText(/electric cars/i)).not.toBeInTheDocument();
    });
  });

  it('articles search filters results', async () => {
    wrap(LearnPage);
    const searchInput = screen.getByRole('searchbox', { name: /search articles/i });
    fireEvent.change(searchInput, { target: { value: 'flying' } });
    await waitFor(() => {
      expect(screen.getByText(/is flying really that bad/i)).toBeInTheDocument();
      expect(screen.queryByText(/fast fashion/i)).not.toBeInTheDocument();
    });
  });

  it('shows no results state when search matches nothing', async () => {
    wrap(LearnPage);
    const searchInput = screen.getByRole('searchbox', { name: /search articles/i });
    fireEvent.change(searchInput, { target: { value: 'zzznomatch' } });
    await waitFor(() => {
      expect(screen.getByText(/no results for/i)).toBeInTheDocument();
    });
  });

  it('clear search button resets articles view', async () => {
    wrap(LearnPage);
    const searchInput = screen.getByRole('searchbox', { name: /search articles/i });
    fireEvent.change(searchInput, { target: { value: 'zzznomatch' } });
    await waitFor(() => screen.getByText(/no results for/i));

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));
    await waitFor(() => {
      expect(screen.queryByText(/no results for/i)).not.toBeInTheDocument();
    });
  });

  it('tabpanel has correct aria-labelledby', () => {
    wrap(LearnPage);
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-articles');
  });
});
