// =============================================================================
// SECTION: Shared Backend Constants
// Domain values used across multiple route files. Centralised here so the
// same validation rules apply everywhere a column is written.
// =============================================================================

'use strict';

/** Countries accepted for the user profile `country` column. */
const VALID_COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'Norway', 'Canada',
  'Australia', 'India', 'France', 'Other',
];

/** Lifestyle options accepted for the user `lifestyle` column. */
const VALID_LIFESTYLES = ['car', 'transit', 'cyclist', 'flyer'];

/** Activity / goal emission categories. */
const ACTIVITY_CATEGORIES = ['transport', 'diet', 'energy', 'shopping', 'waste'];
const GOAL_CATEGORIES      = [...ACTIVITY_CATEGORIES, 'general'];

/** Goal lifecycle statuses. */
const GOAL_STATUSES = ['active', 'completed', 'failed'];

module.exports = {
  VALID_COUNTRIES,
  VALID_LIFESTYLES,
  ACTIVITY_CATEGORIES,
  GOAL_CATEGORIES,
  GOAL_STATUSES,
};
