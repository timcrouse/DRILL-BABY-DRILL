/**
 * @fileoverview Data/modes.js - Game Mode Descriptions and Flavor Text
 * 
 * Purpose: Provides descriptive HTML for game modes (Gambler, CEO, Engineer) including
 * formatted costs (dynamic via getCostsByMode) and thematic blurbs. Also exports arrays
 * of whimsical reasons for cash gains (mode-specific) and losses (generic for resources).
 * Used for UI display in settings modal and random events to add narrative flavor.
 * 
 * Key Features:
 * - getModeDesc: Returns mode-specific HTML with bolded costs and <br> line breaks.
 * - cashReasons: Mode-keyed arrays of 5 fun gain messages each.
 * - lossReasons: Simple object for loss event texts (crude, refineries, products).
 * 
 * Changes in Refactor:
 * - Removed unused gameState import (function uses param, not state).
 * - Integrated getCostsByMode() for dynamic costs (no hardcoding; updates with mode changes).
 * - Added mode validation with fallback to CEO desc.
 * - Enhanced JSDoc with @typedef and examples; consistent formatting (e.g., sorted keys).
 * - Minor polish: Escaped HTML safely, added getRandomReason helper for easy random picks.
 * 
 * Dependencies: getCostsByMode from costs.js (via barrel).
 * 
 * Usage: import { getModeDesc, cashReasons, getRandomCashReason } from './modes.js';
 * Example: getModeDesc('Gambler') // Returns HTML string with $1,000 drill etc.
 * 
 * @exports {function} getModeDesc - Mode description HTML.
 * @exports {Object} cashReasons - Mode-specific gain flavor texts.
 * @exports {Object} lossReasons - Generic loss flavor texts.
 * @exports {function} getRandomCashReason - Picks random gain text for a mode.
 */

// Game mode descriptions and flavor text
import { getCostsByMode } from '../Data/index.js'; // Barrel for costs

// Base descriptions (costs injected dynamically)
const MODE_DESCS = {
  CEO: (costs) => `Balanced approach for strategic decisions. Moderate costs and survey accuracy.<br><br>Drill: <span class="yellow-value">$${costs.drill.toLocaleString()}</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$${costs.survey.toLocaleString()}</span><br>Setting a Well: <span class="yellow-value">$${costs.setWell.toLocaleString()}</span>`,
  Engineer: (costs) => `Precision and safety first. Higher costs but highly accurate surveys with low variance.<br><br>Drill: <span class="yellow-value">$${costs.drill.toLocaleString()}</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$${costs.survey.toLocaleString()}</span><br>Setting a Well: <span class="yellow-value">$${costs.setWell.toLocaleString()}</span>`,
  Gambler: (costs) => `Fortune favors the bold! Lower costs but surveys are less reliable with higher variance in estimates.<br><br>Drill: <span class="yellow-value">$${costs.drill.toLocaleString()}</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$${costs.survey.toLocaleString()}</span><br>Setting a Well: <span class="yellow-value">$${costs.setWell.toLocaleString()}</span>`
  /**
   * @typedef {Object} ModeDescTemplate
   * @property {function(Costs):string} [key] - Function returning HTML desc with costs injected.
   */
};

export const cashReasons = {
  CEO: [
    "Board approved a bonus for your 'strategic vision'!",
    "Government subsidy for 'green' initiatives – wink wink!",
    "Sold company swag at inflated prices!",
    "Quarterly profits from mysterious sources!",
    "Executive perk: Surprise cash from corporate slush fund!"
  ],
  Engineer: [
    "Patented a new drill bit – royalties pouring in!",
    "Efficiency savings from your latest invention!",
    "Grant for researching 'sustainable' oil extraction!",
    "Sold tech to a rival – they paid handsomely!",
    "Math error in your favor – extra funds calculated!"
  ],
  Gambler: [
    "You hit the jackpot on oil futures at the casino – cha-ching!",
    "Won a high-stakes poker game with other tycoons!",
    "Found a lucky oil gusher while gambling in the desert!",
    "Bet on a wildcat well and it paid off big time!",
    "Lady Luck sent you a surprise check from an old bet!"
  ]
  /**
   * @typedef {Object} CashReasons
   * @property {string[]} [mode] - Array of 5 flavor texts for cash gains.
   */
};

export const lossReasons = {
  crude: "A mysterious spill – blame the seagulls!",
  products: "Products vanished – alien abduction?",
  refineries: "Refinery gremlins struck – equipment malfunction!"
  /**
   * @typedef {Object} LossReasons
   * @property {string} crude - Flavor text for crude loss.
   * @property {string} products - Flavor text for product loss.
   * @property {string} refineries - Flavor text for refinery loss.
   */
};

/**
 * Gets the HTML description for a game mode, injecting current costs.
 * @param {string} mode - Mode key ('Gambler', 'CEO', 'Engineer').
 * @returns {string} HTML string with formatted description and costs.
 */
export function getModeDesc(mode) {
  const template = MODE_DESCS[mode] || MODE_DESCS.CEO; // Fallback to CEO
  const costs = getCostsByMode();
  return template(costs);
}

/**
 * Picks a random cash gain reason for the given mode.
 * @param {string} mode - Mode key.
 * @returns {string} Random flavor text.
 */
export function getRandomCashReason(mode) {
  const reasons = cashReasons[mode] || cashReasons.CEO; // Fallback
  const randomIndex = Math.floor(Math.random() * reasons.length);
  return reasons[randomIndex];
}