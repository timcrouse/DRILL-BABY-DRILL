/**
 * @fileoverview Data/prices.js - Price Initialization and Management
 * 
 * Purpose: Initializes game commodity prices using random variance within defined ranges
 * (from constants.js) and derives ethanol/biodiesel from base fuels (85% gasoline, 75% diesel).
 * Exports initial prices as a const object for UI display and calculations; supports one-time
 * setup on app load, with potential for future updates (e.g., market fluctuations per turn).
 * 
 * Key Features:
 * - initPrices: Generates randomized prices with 2-decimal precision.
 * - Derived prices: Ethanol from gasoline, biodiesel from diesel for economic linkage.
 * - Relies on randomWithVariance for realistic spreads.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Utils/index.js, ../Data/index.js) for consistency.
 * - Added optional param to initPrices for custom ranges (e.g., testing fixed values).
 * - Enhanced with validation (ensure ranges valid) and logging for debug.
 * - Added updatePrices function stub for future turn-based refreshes (calls initPrices).
 * - JSDoc with @typedef for prices object; consistent key order.
 * 
 * Dependencies: randomWithVariance from Utils/index.js; PRICE_RANGES from constants.js (via barrel).
 * 
 * Usage: import { gamePrices, initPrices, updatePrices } from './prices.js';
 * Example: gamePrices.crude // ~random in [11.27, 133.96]; updatePrices() for market tick.
 * 
 * @exports {Object} gamePrices - Initialized price object.
 * @exports {function} initPrices - Generates new prices (optionally with custom ranges).
 * @exports {function} updatePrices - Refreshes prices (future: per-turn variance).
 * @typedef {Object} Prices
 * @property {number} crude - Current crude oil price.
 * @property {number} gasoline - Gasoline price.
 * @property {number} diesel - Diesel price.
 * @property {number} ethanol - Derived from gasoline (85%).
 * @property {number} biodiesel - Derived from diesel (75%).
 */

// Price initialization and management
import { randomWithVariance } from '../Utils/index.js'; // Barrel import
import { PRICE_RANGES } from '../Data/index.js'; // Barrel for constants

// Base keys for independent randomization
const BASE_PRICES = ['crude', 'gasoline', 'diesel'];

/**
 * Initializes or regenerates commodity prices with variance.
 * @param {Object} [customRanges] - Optional overrides for PRICE_RANGES.
 * @returns {Prices} Object with all prices (derived included).
 */
export function initPrices(customRanges = PRICE_RANGES) {
  // Validate ranges
  if (!customRanges || typeof customRanges !== 'object') {
    console.warn('initPrices: Invalid ranges; using defaults.');
    customRanges = PRICE_RANGES;
  }

  const prices = {};
  
  // Randomize base prices
  BASE_PRICES.forEach(key => {
    const range = customRanges[key];
    if (range && typeof range.min === 'number' && typeof range.max === 'number') {
      prices[key] = randomWithVariance(range);
    } else {
      console.warn(`initPrices: Invalid range for ${key}; skipping.`);
      prices[key] = 0;
    }
  });

  // Derive secondary prices (2-decimal fixed)
  prices.ethanol = +(prices.gasoline * 0.85).toFixed(2);
  prices.biodiesel = +(prices.diesel * 0.75).toFixed(2);

  // Debug log
  console.log('Prices initialized:', prices);

  return prices;
}

/**
 * Updates prices (e.g., for market fluctuation on turn end).
 * Currently reinits; extend for delta-based changes later.
 */
export function updatePrices() {
  Object.assign(gamePrices, initPrices());
  console.log('Prices updated:', gamePrices);
}

// Initial prices (computed once on module load)
export const gamePrices = initPrices();