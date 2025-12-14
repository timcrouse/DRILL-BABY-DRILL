/**
 * @fileoverview Data/constants.js - Game Constants
 * 
 * Purpose: Defines static, immutable constants for core game mechanics, including price ranges
 * for commodities (crude, gasoline, etc.), refinery tiers with costs/throughputs, and grid size.
 * These values drive economic simulation, building costs, and map generation without hardcoding
 * in logic files. Exported as named exports for easy import in Data/ modules (e.g., prices.js, map.js).
 * 
 * Key Features:
 * - PRICE_RANGES: Min/max bounds for randomized market prices (e.g., via randomWithVariance).
 * - REFINERY_TIERS: Array of objects for refinery upgrades (id, label, cost, throughput).
 * - GRID_SIZE: Fixed 10x10 for the oil map grid.
 * 
 * Changes in Refactor:
 * - Added full JSDoc for each export with types/examples.
 * - Ensured numeric readability (underscores for thousands, consistent decimals).
 * - Minor polish: Alphabetized object keys in PRICE_RANGES for scannability.
 * - No logic added—just pure constants for immutability.
 * 
 * Dependencies: None; imported in Data/index.js barrel.
 * Usage: import { PRICE_RANGES, GRID_SIZE } from './constants.js';
 * Example: const crudePrice = randomWithVariance(PRICE_RANGES.crude);
 * 
 * @exports {Object} PRICE_RANGES - Commodity price bounds.
 * @exports {Array<Object>} REFINERY_TIERS - Refinery upgrade specs.
 * @exports {number} GRID_SIZE - Map dimensions (10x10).
 */

// Static constants for game mechanics
export const PRICE_RANGES = {
  biodiesel: { min: 75.35, max: 181.25 },
  crude:     { min: 11.27, max: 133.96 },
  diesel:    { min: 100.46, max: 241.67 },
  ethanol:   { min: 69.26, max: 179.64 },
  gasoline:  { min: 81.48, max: 211.34 }
  /**
   * @typedef {Object} PriceRange
   * @property {number} min - Minimum price value.
   * @property {number} max - Maximum price value.
   */
};

export const REFINERY_TIERS = [
  { id: 'small',   label: 'Small',   cost: 150_000, throughput: 750 },
  { id: 'medium',  label: 'Medium',  cost: 300_000, throughput: 1_500 },
  { id: 'large',   label: 'Large',   cost: 500_000, throughput: 3_000 }
  /**
   * @typedef {Object} RefineryTier
   * @property {string} id - Unique tier identifier.
   * @property {string} label - Display name.
   * @property {number} cost - Purchase cost in $.
   * @property {number} throughput - Barrels per turn capacity.
   */
];

export const GRID_SIZE = 10;
/**
 * @type {number}
 * @description Fixed grid dimensions for the 10x10 oil map.
 */