// =============================================================================
// SECTION: App-Wide Constants
// Central place for all magic strings, route paths, category configs, and
// emission-factor data used across the application.
// =============================================================================

// --- Route Paths ---
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  LOG: '/dashboard/log',
  INSIGHTS: '/dashboard/insights',
  GOALS: '/dashboard/goals',
  COMMUNITY: '/dashboard/community',
  LEARN: '/dashboard/learn',
};

// --- Emission Categories ---
// Each category has an id, display label, icon name (Material Symbols), and
// a tailwind colour class used for badges and chart segments.
export const EMISSION_CATEGORIES = [
  {
    id: 'transport',
    label: 'Transport',
    icon: 'commute',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    chartColor: '#006b2c',
  },
  {
    id: 'diet',
    label: 'Diet',
    icon: 'restaurant',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    chartColor: '#2e6a41',
  },
  {
    id: 'energy',
    label: 'Energy',
    icon: 'bolt',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    chartColor: '#8d4b00',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: 'shopping_bag',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    chartColor: '#7c3aed',
  },
  {
    id: 'waste',
    label: 'Waste',
    icon: 'delete',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    chartColor: '#0d9488',
  },
];

// --- Carbon Score Status Thresholds ---
// Used to colour-code daily carbon totals (kg CO₂e)
export const CARBON_STATUS = {
  LOW: { max: 5, label: 'Great', color: 'text-primary', bg: 'bg-secondary-container' },
  MODERATE: { max: 15, label: 'Moderate', color: 'text-yellow-700', bg: 'bg-tertiary-fixed' },
  HIGH: { max: Infinity, label: 'High', color: 'text-red-700', bg: 'bg-error-container' },
};

// --- Weekly chart mock data (Mon–Sun) ---
export const WEEKLY_CHART_DATA = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 70 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 80 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 20 },
];

// --- Lifestyle options used in onboarding step 1 ---
export const LIFESTYLE_OPTIONS = [
  {
    id: 'car',
    icon: 'directions_car',
    label: 'Car Owner',
    description: 'Daily driving and individual travel.',
  },
  {
    id: 'transit',
    icon: 'train',
    label: 'Public Transit',
    description: 'Metro, bus, and regional rail lines.',
  },
  {
    id: 'cyclist',
    icon: 'pedal_bike',
    label: 'Cyclist',
    description: 'Active mobility and low emission.',
  },
  {
    id: 'flyer',
    icon: 'flight',
    label: 'Frequent Flyer',
    description: 'Regular long-distance air travel.',
  },
];

// --- Concern options used in onboarding step 2 ---
export const CONCERN_OPTIONS = [
  { id: 'transport', icon: 'local_shipping', label: 'Transport' },
  { id: 'food', icon: 'restaurant', label: 'Food' },
  { id: 'energy', icon: 'bolt', label: 'Energy' },
  { id: 'shopping', icon: 'shopping_bag', label: 'Shopping' },
  { id: 'waste', icon: 'delete', label: 'Waste' },
];

// --- Sidebar navigation items used in dashboard layout ---
export const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard',   path: ROUTES.DASHBOARD },
  { id: 'log',       icon: 'add_circle',   label: 'Log Activity',path: ROUTES.LOG },
  { id: 'insights',  icon: 'insights',     label: 'Insights',    path: ROUTES.INSIGHTS },
  { id: 'goals',     icon: 'track_changes',label: 'Goals',       path: ROUTES.GOALS },
  { id: 'community', icon: 'group',        label: 'Community',   path: ROUTES.COMMUNITY },
  { id: 'learn',     icon: 'menu_book',    label: 'Learn',       path: ROUTES.LEARN },
];

// --- Mobile bottom nav (condensed) ---
export const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard',  label: 'Dashboard', path: ROUTES.DASHBOARD },
  { id: 'log',       icon: 'add_circle', label: 'Log',       path: ROUTES.LOG },
  { id: 'insights',  icon: 'insights',   label: 'Insights',  path: ROUTES.INSIGHTS },
  { id: 'community', icon: 'group',      label: 'Social',    path: ROUTES.COMMUNITY },
  { id: 'learn',     icon: 'menu_book',  label: 'Learn',     path: ROUTES.LEARN },
];
