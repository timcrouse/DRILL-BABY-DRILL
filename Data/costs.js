/**
 * @fileoverview Data/costs.js - Mode-Specific Cost Calculations
 * 
 * Purpose: Computes action costs (drill, set well, survey) based on the current game mode
 * (Gambler: low risk/low cost; Engineer: high risk/high cost; default: balanced).
 * Returns an object with costs tailored to gameState.mode, enabling dynamic pricing
 * for different playstyles without hardcoding in UI or actions.
 * 
 * Key Features:
 * - Mode-based ternary logic for simplicity (Gambler cheap, Engineer expensive).
 * - Defaults to balanced mode if invalid.
 * - No side effects; pure function relying on imported gameState.
 * 
 * Changes in Refactor:
 * - Updated import to barrel (../Data/index.js) for modularity.
 * - Replaced ternaries with a mode-cost map object for readability/extensibility.
 * - Added mode validation with console warn and default fallback.
 * - Enhanced JSDoc with @returns typedef and examples.
 * - Minor polish: Consistent spacing, numeric formatting if needed later.
 * 
 * Dependencies: gameState from Data/state.js (via barrel).
 * 
 * Usage: import { getCostsByMode } from './costs.js'; // Or via Data/index.js
 * Example: const costs = getCostsByMode(); // { drill: 1000, setWell: 15000, survey: 3000 } for 'Gambler'
 * 
 * @exports {function} getCostsByMode - Returns mode-adjusted costs object.
 * @returns {Object} Costs with drill, setWell, survey properties (numbers).
 * @typedef {Object} Costs
 * @property {number} drill - Cost to drill a well.
 * @property {number} setWell - Cost to set up a well.
 * @property {number} survey - Cost for geo survey.
 */

// Mode-specific cost calculations
import { gameState } from '../Data/index.js'; // Barrel import for modularity

// Cost map by mode: { [mode]: { drill, setWell, survey } }
const MODE_COSTS = {
  Gambler: { drill: 1000, setWell: 15000, survey: 3000 },
  Engineer: { drill: 3000, setWell: 25000, survey: 7000 },
  default: { drill: 1500, setWell: 20000, survey: 5000 }
};

/**
 * Retrieves costs adjusted for the current game mode.
 * @returns {Costs} Object with drill, setWell, and survey costs.
 */
export function getCostsByMode() {
  const mode = gameState.mode;
  
  // Validate mode and fallback
  if (!MODE_COSTS[mode]) {
    console.warn(`getCostsByMode: Invalid mode '${mode}'; defaulting to balanced costs.`);
    return MODE_COSTS.default;
  }
  
  return MODE_COSTS[mode];
}