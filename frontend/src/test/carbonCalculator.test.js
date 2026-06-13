// =============================================================================
// SECTION: Carbon Calculator Tests
// Tests the core emission factor × quantity calculation logic.
// These are pure functions — no rendering needed.
// =============================================================================

import { describe, it, expect } from 'vitest';

// =============================================================================
// Inline the calculation logic (mirrors LogActivityPage CATEGORIES data)
// =============================================================================
const FACTORS = {
  car_petrol: 0.21,
  car_ev:     0.05,
  bus:        0.089,
  train:      0.041,
  flight:     0.255,
  cycle:      0,
  beef:       6.61,
  chicken:    1.26,
  vegan:      0.50,
  elec:       0.233,
  gas:        2.04,
  clothing:   8.1,
  landfill:   0.57,
  recycled:   0.02,
};

function calcCarbon(subtypeId, quantity) {
  const factor = FACTORS[subtypeId] ?? 0;
  return Math.round(quantity * factor * 1000) / 1000;
}

// =============================================================================
describe('Carbon Calculator', () => {
  it('calculates car petrol emissions correctly', () => {
    expect(calcCarbon('car_petrol', 100)).toBe(21);
  });

  it('calculates EV emissions (lower than petrol)', () => {
    expect(calcCarbon('car_ev', 100)).toBe(5);
    expect(calcCarbon('car_ev', 100)).toBeLessThan(calcCarbon('car_petrol', 100));
  });

  it('returns 0 for cycling', () => {
    expect(calcCarbon('cycle', 50)).toBe(0);
  });

  it('calculates beef meal emissions', () => {
    expect(calcCarbon('beef', 1)).toBe(6.61);
    expect(calcCarbon('beef', 3)).toBeCloseTo(19.83, 2);
  });

  it('vegan meal emits less than beef', () => {
    expect(calcCarbon('vegan', 1)).toBeLessThan(calcCarbon('beef', 1));
  });

  it('handles zero quantity', () => {
    expect(calcCarbon('car_petrol', 0)).toBe(0);
  });

  it('handles fractional quantities', () => {
    expect(calcCarbon('elec', 0.5)).toBeCloseTo(0.117, 2);
  });

  it('landfill waste emits more than recycled', () => {
    expect(calcCarbon('landfill', 1)).toBeGreaterThan(calcCarbon('recycled', 1));
  });

  it('returns 0 for unknown subtype', () => {
    expect(calcCarbon('unknown_type', 10)).toBe(0);
  });

  it('flight emissions scale linearly', () => {
    const single = calcCarbon('flight', 1);
    expect(calcCarbon('flight', 4)).toBeCloseTo(single * 4, 2);
  });
});
