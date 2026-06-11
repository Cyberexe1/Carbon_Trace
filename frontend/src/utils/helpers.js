// =============================================================================
// Helper / Utility Functions
// Pure functions with no side effects — fully unit-testable.
// =============================================================================

import { CARBON_STATUS, CATEGORIES } from './constants';

// --- Carbon Status Resolver ---
// Returns the status object (label, colors) based on today's kg value.
export function getCarbonStatus(kg) {
  if (kg <= CARBON_STATUS.LOW.max)      return CARBON_STATUS.LOW;
  if (kg <= CARBON_STATUS.MODERATE.max) return CARBON_STATUS.MODERATE;
  return CARBON_STATUS.HIGH;
}

// --- Category Lookup ---
// Returns full category object by id string.
export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

// --- Carbon Number Formatter ---
// Formats a float to "8.4 kg CO₂e" — always 1 decimal place.
export function formatCarbonKg(kg) {
  return `${Number(kg).toFixed(1)} kg CO₂e`;
}

// --- Trend Formatter ---
// Returns a signed string like "↑ 5%" or "↓ 12%"
export function formatTrend(percent) {
  if (percent === 0) return '— 0%';
  const arrow = percent > 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(percent)}%`;
}

// --- Trend Color Class ---
// Negative trend (less carbon) is green; positive is red.
export function trendColorClass(percent) {
  if (percent === 0) return 'text-gray-500';
  return percent < 0 ? 'text-[#006b2c]' : 'text-red-600';
}

// --- Difficulty Stars Renderer ---
// Returns a string of filled/empty stars for difficulty 1-5.
export function difficultyStars(level, max = 3) {
  return '⭐'.repeat(level) + '☆'.repeat(max - level);
}

// --- Clamp utility ---
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
