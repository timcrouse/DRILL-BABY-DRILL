/**
 * @fileoverview Utils/index.js - Utils Module Barrel Exports
 * 
 * Purpose: Central re-export for utility functions.
 * Aggregates from individual utils files for easy access.
 * 
 * Key Features:
 * - Simple re-exports (e.g., getRandomElement).
 * - No logic—just barrel.
 * 
 * Dependencies: Individual utils files in this directory.
 * 
 * Usage: Import from this file (e.g., in main.js).
 */

// Re-exports from getRandomElement.js
export { getRandomElement } from './getRandomElement.js';

// Re-exports from randomWithVariance.js
export { randomWithVariance } from './randomWithVariance.js';