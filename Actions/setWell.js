/**
 * @fileoverview Actions/setWell.js - Well Setting Action
 * 
 * Purpose: Sets a well at (x,y) after drilling: Deducts mode-adjusted cost, marks well as true
 * in wells state, and updates UI. Validates coords, prior drilling (error modal if not), and funds.
 * Enables production setup post-drill; ties into strike logic from drillWell.
 * 
 * Key Features:
 * - Requires drilled well; costs from getCostsByMode().
 * - Silent fail on low cash (or modal?); error on undrilled.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js).
 * - Added coord validation (1-10 integers) and drilled/cash error modals (non-silent UX).
 * - Enhanced with logging; JSDoc with @param/@typedef.
 * - Minor polish: Optional chaining safe, consistent error flow.
 * 
 * Dependencies: gameState/getCostsByMode/wells from Data/index.js; updateGameUI/showModalMessage from UI/index.js.
 * 
 * Usage: import { setWell } from './setWell.js'; // Bound to setWellBtn.onclick.
 * Example: setWell(3, 4); // Deducts ~$20k if drilled/cash ok, well=true.
 * 
 * @exports {function} setWell - Sets well at (x,y) with validation/effects.
 * @param {number} x - Column (1-10).
 * @param {number} y - Row (1-10).
 * @throws {Error} If invalid coords.
 * @typedef {Object} WellData
 * @property {boolean} well - Whether well is set (true after this).
 */

// Well setting action
import { gameState, getCostsByMode, wells } from '../Data/index.js'; // Barrel for data
import { updateGameUI, showModalMessage } from '../UI/index.js'; // Barrel for UI

/**
 * Sets a well at (x,y) if drilled and funded: Deducts cost, marks well=true.
 * @param {number} x - Grid column (1-10).
 * @param {number} y - Grid row (1-10).
 * @throws {Error} If invalid coordinates.
 */
export function setWell(x, y) {
  // Validate coords
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 1 || x > 10 || y < 1 || y > 10) {
    throw new Error(`Invalid coordinates: x=${x}, y=${y} (must be integers 1-10).`);
  }

  const costs = getCostsByMode();
  const key = `${x},${y}`;
  const well = wells[key];

  // Check drilled
  if (!well?.drilled) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Well Not Drilled</h2>
        <p>You must drill at (${x}, ${y}) first before setting a well.</p>
        <br>
        <button class="main-btn" id="drillFirstOk">OK</button>
      </div>
    `);

    // Bind OK for error modal
    setTimeout(() => {
      const okBtn = document.querySelector('#modalMsgContent #drillFirstOk');
      if (okBtn) {
        okBtn.addEventListener('click', () => {
          import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
        }, { once: true });
      }
    }, 50);

    return;
  }

  // Check funds
  if (gameState.cash < costs.setWell) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Insufficient Funds</h2>
        <p>You need <span class="yellow-value">$${costs.setWell.toLocaleString()}</span> to set a well. Earn more cash!</p>
        <br>
        <button class="main-btn" id="setWellFundsOk">OK</button>
      </div>
    `);

    // Bind OK for funds error
    setTimeout(() => {
      const fundsOk = document.querySelector('#modalMsgContent #setWellFundsOk');
      if (fundsOk) {
        fundsOk.addEventListener('click', () => {
          import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
        }, { once: true });
      }
    }, 50);

    return;
  }

  // Deduct and set well
  gameState.cash -= costs.setWell;
  well.well = true;

  // Update UI
  updateGameUI();

  console.log(`Well set at (${x},${y}): Cash deducted $${costs.setWell.toLocaleString()}. Remaining: $${gameState.cash.toLocaleString()}`);
}