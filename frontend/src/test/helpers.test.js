// =============================================================================
// SECTION: helpers.js Unit Tests
// Pure utility functions — full coverage of every exported helper.
// =============================================================================

import { describe, it, expect } from 'vitest';
import {
  getCarbonStatus,
  getCategoryById,
  formatCarbonKg,
  formatTrend,
  trendColorClass,
  difficultyStars,
  clamp,
} from '../utils/helpers';
import { CARBON_STATUS, EMISSION_CATEGORIES } from '../utils/constants';

describe('getCarbonStatus', () => {
  it('returns LOW for values at or below the low threshold', () => {
    expect(getCarbonStatus(0)).toBe(CARBON_STATUS.LOW);
    expect(getCarbonStatus(5)).toBe(CARBON_STATUS.LOW);
  });

  it('returns MODERATE for values between low and moderate thresholds', () => {
    expect(getCarbonStatus(6)).toBe(CARBON_STATUS.MODERATE);
    expect(getCarbonStatus(15)).toBe(CARBON_STATUS.MODERATE);
  });

  it('returns HIGH for values above the moderate threshold', () => {
    expect(getCarbonStatus(16)).toBe(CARBON_STATUS.HIGH);
    expect(getCarbonStatus(1000)).toBe(CARBON_STATUS.HIGH);
  });
});

describe('getCategoryById', () => {
  it('returns the matching category for a known id', () => {
    expect(getCategoryById('diet')).toEqual(
      EMISSION_CATEGORIES.find((c) => c.id === 'diet')
    );
  });

  it('falls back to the first category for an unknown id', () => {
    expect(getCategoryById('nonexistent')).toBe(EMISSION_CATEGORIES[0]);
  });

  it('falls back to the first category for undefined', () => {
    expect(getCategoryById(undefined)).toBe(EMISSION_CATEGORIES[0]);
  });
});

describe('formatCarbonKg', () => {
  it('formats to one decimal place with unit', () => {
    expect(formatCarbonKg(8.456)).toBe('8.5 kg CO₂e');
    expect(formatCarbonKg(0)).toBe('0.0 kg CO₂e');
  });

  it('handles integer and string-like numeric input', () => {
    expect(formatCarbonKg(10)).toBe('10.0 kg CO₂e');
    expect(formatCarbonKg(3.14159)).toBe('3.1 kg CO₂e');
  });
});

describe('formatTrend', () => {
  it('returns a neutral string for zero', () => {
    expect(formatTrend(0)).toBe('— 0%');
  });

  it('returns an up arrow for positive trends', () => {
    expect(formatTrend(5)).toBe('↑ 5%');
  });

  it('returns a down arrow with absolute value for negative trends', () => {
    expect(formatTrend(-12)).toBe('↓ 12%');
  });
});

describe('trendColorClass', () => {
  it('returns gray for zero', () => {
    expect(trendColorClass(0)).toBe('text-gray-500');
  });

  it('returns green for negative (less carbon)', () => {
    expect(trendColorClass(-5)).toBe('text-[#006b2c]');
  });

  it('returns red for positive (more carbon)', () => {
    expect(trendColorClass(8)).toBe('text-red-600');
  });
});

describe('difficultyStars', () => {
  it('renders filled and empty stars for a level within range', () => {
    expect(difficultyStars(2, 3)).toBe('⭐⭐☆');
  });

  it('renders all filled when level equals max', () => {
    expect(difficultyStars(3, 3)).toBe('⭐⭐⭐');
  });

  it('clamps levels above max instead of producing negative repeats', () => {
    // Previously difficultyStars(5,3) returned 5 filled and no empty stars.
    // With clamping it caps at max and shows no empty stars.
    expect(difficultyStars(5, 3)).toBe('⭐⭐⭐');
  });

  it('clamps negative levels to zero', () => {
    expect(difficultyStars(-2, 3)).toBe('☆☆☆');
  });
});

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when below range', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('returns max when above range', () => {
    expect(clamp(99, 0, 10)).toBe(10);
  });
});
