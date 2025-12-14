/**
 * @fileoverview Utils/randomWithVariance.js - Random Value Generator with Variance
 * 
 * Purpose: Generates a random value between min and max, then applies ±10% variance
 * for more realistic fluctuations (e.g., oil prices, production rates, or depths in the game).
 * Ensures values stay within bounds and rounds to 2 decimal places for currency/depth precision.
 * 
 * Key Features:
 * - Uniform base random in [min, max].
 * - Adds/subtracts up to 10% of base (e.g., for market volatility).
 * - Returns number (not string); handles edge cases like invalid inputs.
 * - No dependencies; pure function.
 * 
 * Changes in Refactor:
 * - Added full JSDoc and input validation (ensures numbers, min <= max; defaults gracefully).
 * - Clamped result to [min, max] to prevent extreme outliers.
 * - Used Math.round for precise decimal handling instead of toFixed coercion.
 * - Added optional debug logging; warns on invalid params.
 * 
 * Dependencies: None.
 * 
 * Usage: Import via Utils/index.js: import { randomWithVariance } from '../Utils/index.js';
 * Example: const price = randomWithVariance({ min: 50, max: 100 }); // e.g., ~45-110
 * 
 * @exports {function} randomWithVariance - Returns random value with ±10% variance.
 * @param {Object} params - { min: number, max: number }
 * @returns {number} Rounded random value in [min, max] with variance applied.
 */

// Utility function for random with variance
export function randomWithVariance({ min, max }) {
  // Validate inputs
  if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
    console.warn('randomWithVariance: Invalid params (min <= max required); using defaults {min:0, max:1}');
    min = 0;
    max = 1;
  }

  if (min === max) {
    return +min.toFixed(2); // No variance needed
  }

  const base = min + Math.random() * (max - min);
  const variance = base * (Math.random() * 0.2 - 0.1); // ±10%
  let result = base + variance;

  // Clamp to [min, max] to avoid extremes
  result = Math.max(min, Math.min(max, result));

  // Round to 2 decimals (e.g., for money/depth)
  result = Math.round(result * 100) / 100;

  // Optional debug log
  // console.log(`randomWithVariance: base=${base.toFixed(2)}, variance=${variance.toFixed(2)}, result=${result}`);

  return result;
}