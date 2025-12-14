/**
 * @fileoverview Actions/drillWell.js - Well Drilling Action
 * 
 * Purpose: Handles drilling a well at (x,y): Deducts cost based on mode, advances depth by 1000ft,
 * marks as drilled, and checks for oil strike (produces if depth >=2000ft and hasOil). Updates
 * wells state and refreshes UI. Validates coords and funds; shows error modal on insufficient cash.
 * Core gameplay loop for exploration.
 * 
 * Key Features:
 * - Mode-adjusted cost via getCostsByMode().
 * - Depth increment: +1000ft per drill; rate = floor(depth/100) bbl if producing.
 * - Bounds check for grid (1-10); oil query at 0-based index.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js).
 * - Added param validation (x,y integers 1-10) and cash error modal (non-silent).
 * - Well init: Use Object.assign for safe mutation if exists.
 * - Enhanced logging/debug; JSDoc with @param/@typedef.
 * - Minor polish: Consistent spacing, bounds error throw (caught in UI).
 * 
 * Dependencies: gameState/getCostsByMode/wells/oilMap from Data/index.js; updateGameUI/showModalMessage from UI/index.js.
 * 
 * Usage: import { drillWell } from './drillWell.js'; // Called from events.js onclick.
 * Example: drillWell(3, 4); // Deducts ~$1500, depth=1000ft; strike if oil & depth>=2000.
 * 
 * @exports {function} drillWell - Drills at (x,y) with validation/effects.
 * @param {number} x - Column (1-10).
 * @param {number} y - Row (1-10).
 * @typedef {Object} WellData
 * @property {boolean} drilled - Whether drilled.
 * @property {number} depth - Current depth in ft.
 * @property {boolean} well - Whether well set.
 * @property {boolean} producing - Whether producing oil.
 * @property {number} currentRate - Barrels per turn.
 */

// Well drilling action
import { gameState, getCostsByMode, wells, oilMap } from '../Data/index.js'; // Barrel for data
import { updateGameUI, showModalMessage } from '../UI/index.js'; // Barrel for UI

const DEPTH_INCREMENT = 1000; // ft per drill
const STRIKE_DEPTH = 2000; // Min depth for production
const RATE_PER_100FT = 1; // bbl per 100ft (floor division)

/**
 * Drills a well at (x,y): Deducts cost, advances depth, checks for oil strike.
 * @param {number} x - Grid column (1-10).
 * @param {number} y - Grid row (1-10).
 * @throws {Error} If invalid coords.
 */
export function drillWell(x, y) {
  // Validate coords
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 1 || x > 10 || y < 1 || y > 10) {
    throw new Error(`Invalid coordinates: x=${x}, y=${y} (must be integers 1-10).`);
  }

  const costs = getCostsByMode();
  if (gameState.cash < costs.drill) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Insufficient Funds</h2>
        <p>You need <span class="yellow-value">$${costs.drill.toLocaleString()}</span> to drill. Earn more cash!</p>
        <br>
        <button class="main-btn" onclick="hideModalMessage()">OK</button>
      </div>
    `);
    return;
  }

  // Deduct cost
  gameState.cash -= costs.drill;

  // Get or init well
  const key = `${x},${y}`;
  if (!wells[key]) {
    wells[key] = { drilled: false, depth: 0, well: false, producing: false, currentRate: 0 };
  }

  // Drill effects
  wells[key].drilled = true;
  wells[key].depth += DEPTH_INCREMENT;

  // Check for strike
  const cellInfo = oilMap[y - 1]?.[x - 1];
  if (cellInfo?.hasOil && wells[key].depth >= STRIKE_DEPTH) {
    wells[key].producing = true;
    wells[key].currentRate = Math.floor(wells[key].depth / 100) * RATE_PER_100FT;
    console.log(`Strike at (${x},${y})! Rate: ${wells[key].currentRate} bbl/turn.`);
  }

  // Update UI
  updateGameUI();

  console.log(`Drilled at (${x},${y}): Depth now ${wells[key].depth}ft. Cash: $${gameState.cash.toLocaleString()}`);
}