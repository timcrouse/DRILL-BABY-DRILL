/**
 * @fileoverview Actions/confirmPurchase.js - Purchase Confirmation Handler
 * 
 * Purpose: Validates and applies a purchase after confirmation, deducting cash from gameState,
 * enabling selected insurances/process improvements, and showing success/error modals.
 * Handles insufficient funds with a friendly error. Updates UI post-purchase and hides modals.
 * Integrates with buySelectedItems for flow completion.
 * 
 * Key Features:
 * - Cash validation before effects.
 * - Applies item effects via config (insurances toggle; placeholders for procs).
 * - Success/error modals with dynamic totals.
 * - Triggers UI update and button label refresh.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js, ../Actions/index.js).
 * - Replaced inline onclick with addEventListener in showSuccessModal helper.
 * - Extracted ITEM_EFFECTS config for extensible application (e.g., insurances).
 * - Added validation (e.g., positive totalCost, array items) and logging.
 * - Enhanced error handling (e.g., invalid IDs warn/skip); toLocaleString for formatting.
 * - JSDoc with @typedef; consistent spacing, future-proof for more effects.
 * 
 * Dependencies: gameState from Data/index.js; updateGameUI/showModalMessage from UI/index.js; hidePurchaseOrder/updateTurnButtonLabel from Actions.
 * 
 * Usage: Exported for confirmPurchase(selectedIds, totalCost) from buySelectedItems.
 * Example: confirmPurchase(['insFire'], 2000); // Deducts cash, sets fire insurance true.
 * 
 * @exports {function} confirmPurchase - Processes purchase with validation/effects.
 * @param {string[]} itemIds - Array of item IDs (e.g., ['insFire']).
 * @param {number} totalCost - Total purchase cost.
 * @typedef {Object} ItemEffects
 * @property {function(string):void} [ins*] - Toggles insurance type.
 */

// Purchase confirmation handler
import { gameState } from '../Data/index.js'; // Barrel for state
import { updateGameUI, showModalMessage } from '../UI/index.js'; // Barrel for UI
import { hidePurchaseOrder, updateTurnButtonLabel } from '../Actions/index.js'; // Local barrel

// Config for item effects (extendable; maps ID to applicator function)
const ITEM_EFFECTS = {
  insFire: () => { gameState.insurances.fire = true; },
  insFlood: () => { gameState.insurances.flood = true; },
  insLabor: () => { gameState.insurances.labor = true; },
  procCrude: () => { /* e.g., gameState.crudeEfficiency += 0.1; */ console.log('Crude optimization applied'); },
  procRef: () => { /* e.g., gameState.refineryBonus += 10; */ console.log('Refinery improvement applied'); },
  procGeo: () => { /* e.g., gameState.surveyAccuracy += 20; */ console.log('Geo modernization applied'); }
  /**
   * @typedef {Object} ItemEffects
   * @property {function():void} [id] - Side-effect function for the item.
   */
};

/**
 * Helper to show success modal with event-bound OK button.
 * @param {number} totalCost - Purchase total for display.
 */
function showSuccessModal(totalCost) {
  const successContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Purchase Confirmed</h2>
      <p>Purchase completed successfully for <span class="yellow-value">$${totalCost.toLocaleString()}</span>.</p>
      <br>
      <button class="main-btn" id="okBtn">OK</button>
    </div>
  `;

  showModalMessage(successContent);

  // Bind OK button post-show (assumes modalMsgContent query)
  setTimeout(() => { // Delay for modal render
    const okBtn = document.querySelector('#modalMsgContent #okBtn');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        // Use dynamic import to avoid potential circular deps
        import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
        if (updateTurnButtonLabel) updateTurnButtonLabel();
      }, { once: true }); // Single use
    }
  }, 50);
}

/**
 * Confirms and applies the purchase: Validates cash, applies effects, updates UI.
 * @param {string[]} itemIds - Array of selected item IDs.
 * @param {number} totalCost - Total cost to deduct.
 */
export function confirmPurchase(itemIds, totalCost) {
  // Validate inputs
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    console.warn('confirmPurchase: Invalid or empty itemIds.');
    hidePurchaseOrder();
    return;
  }
  if (typeof totalCost !== 'number' || totalCost <= 0) {
    console.warn('confirmPurchase: Invalid totalCost.');
    hidePurchaseOrder();
    return;
  }

  // Check funds
  if (gameState.cash < totalCost) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Not Enough Cash</h2>
        <p>Not enough cash to complete the purchase.</p>
        <br>
        <button class="main-btn" id="okFundsBtn">OK</button>
      </div>
    `);

    // Bind OK for funds modal
    setTimeout(() => {
      const okFundsBtn = document.querySelector('#modalMsgContent #okFundsBtn');
      if (okFundsBtn) {
        okFundsBtn.addEventListener('click', () => {
          import('../Actions/index.js').then(({ showTurnModal }) => showTurnModal());
        }, { once: true });
      }
    }, 50);

    hidePurchaseOrder();
    return;
  }

  // Apply effects
  let appliedCount = 0;
  itemIds.forEach(id => {
    const effect = ITEM_EFFECTS[id];
    if (effect) {
      effect();
      appliedCount++;
      console.log(`Applied effect for ${id}`);
    } else {
      console.warn(`confirmPurchase: No effect for unknown ID '${id}'`);
    }
  });

  if (appliedCount === 0) {
    console.error('confirmPurchase: No valid effects applied.');
    hidePurchaseOrder();
    return;
  }

  // Deduct cash and update
  gameState.cash -= totalCost;
  updateGameUI();

  // Hide PO and show success
  hidePurchaseOrder();
  showSuccessModal(totalCost);

  console.log(`Purchase confirmed: ${appliedCount} items, deducted $${totalCost.toLocaleString()}. Remaining cash: $${gameState.cash.toLocaleString()}`);
}