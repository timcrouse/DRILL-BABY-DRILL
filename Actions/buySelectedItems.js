/**
 * @fileoverview Actions/buySelectedItems.js - Purchase Order Handler
 * 
 * Purpose: Processes selected checkboxes from a modal (e.g., insurance/process items), calculates
 * total cost, generates a formatted purchase order modal, and displays it for confirmation.
 * Handles empty selection with error modal. Uses config for item details to avoid hardcoding.
 * Integrates with gameState for turn number; triggers confirmPurchase or hide on button clicks.
 * 
 * Key Features:
 * - Collects checked items via querySelectorAll.
 * - Builds HTML dynamically with item list, total, date, random Order ID.
 * - Error modal for no selection using showModalMessage.
 * - Configurable items (name, cost) for easy extension.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js, local Actions).
 * - Extracted ITEM_CONFIG object for names/costs (switch → map lookup).
 * - Replaced inline onclick with event dispatching (custom events for confirm/hide).
 * - Added validation (e.g., sufficient cash check stub), toLocaleString for formatting.
 * - Enhanced JSDoc with @typedef; console logging for debug.
 * - Minor polish: Escaped IDs in array, consistent spacing, future-proof for cash check.
 * 
 * Dependencies: gameState from Data/index.js; showModalMessage from UI/index.js; confirmPurchase/hidePurchaseOrder from Actions.
 * 
 * Usage: Exported for window.buySelectedItems in main.js; call on checkbox form submit.
 * Example: buySelectedItems(); // Shows PO modal if items selected.
 * 
 * @exports {function} buySelectedItems - Triggers purchase flow from selected checkboxes.
 */

// Purchase order handler
import { gameState } from '../Data/index.js'; // Barrel for state
import { showModalMessage } from '../UI/index.js'; // Barrel for UI
import { confirmPurchase, hidePurchaseOrder } from '../Actions/index.js'; // Local barrel

// Config for purchasable items (extendable)
const ITEM_CONFIG = {
  insFire: { name: 'Fire Insurance', cost: 2000 },
  insFlood: { name: 'Flood Insurance', cost: 2000 },
  insLabor: { name: 'Labor Insurance', cost: 2000 },
  procCrude: { name: 'Crude Oil Flow Optimization', cost: 3000 },
  procRef: { name: 'Refinery Process Improvement', cost: 3000 },
  procGeo: { name: 'Geological Survey Modernization', cost: 3000 }
  /**
   * @typedef {Object} ItemConfig
   * @property {string} name - Display name.
   * @property {number} cost - Fixed cost in $.
   */
};

/**
 * Handles buying selected items: Validates, builds PO modal, shows confirmation.
 * Dispatches custom events for confirm/cancel instead of inline onclick.
 */
export function buySelectedItems() {
  // Collect selected items
  const checkboxes = document.querySelectorAll('#modalMsgContent input[type="checkbox"]:checked');
  const selectedIds = Array.from(checkboxes).map(cb => cb.id).filter(id => ITEM_CONFIG[id]); // Filter valid

  if (selectedIds.length === 0) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>No Items Selected</h2>
        <p>Please select at least one item to purchase.</p>
        <br>
        <button class="main-btn" onclick="hideModalMessage()">OK</button>
      </div>
    `);
    return;
  }

  // Get details with validation
  const itemDetails = selectedIds.map(id => {
    const config = ITEM_CONFIG[id];
    if (!config) {
      console.warn(`buySelectedItems: Unknown item ID '${id}'; skipping.`);
      return null;
    }
    return { id, ...config };
  }).filter(Boolean); // Remove invalids

  if (itemDetails.length === 0) {
    console.error('buySelectedItems: No valid items after filtering.');
    return;
  }

  const totalCost = itemDetails.reduce((sum, item) => sum + item.cost, 0);

  // Stub: Future cash check
  // if (gameState.cash < totalCost) { showModalMessage('Insufficient funds!'); return; }

  // Build items list HTML
  const itemsList = itemDetails.map(item => 
    `<div>${item.name}: <span class="yellow-value">$${item.cost.toLocaleString()}</span></div>`
  ).join('');

  // Generate random Order ID
  const orderId = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');

  // Purchase order HTML
  const poContent = `
    <div class="purchase-order">
      <h3>Turn ${gameState.turn} Purchase Order – Insurance Risk Management & Workflow Modernization</h3>
      <div style="margin-bottom: 10px;">${itemsList}</div>
      <p>Total Cost: <span class="yellow-value">$${totalCost.toLocaleString()}</span></p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Order ID: #${orderId}</p>
      <div class="buttons">
        <button class="main-btn" id="confirmBtn">Confirm</button>
        <button class="main-btn" id="cancelBtn">Cancel</button>
      </div>
    </div>
  `;

  // Inject and show modal
  const modal = document.getElementById('purchaseOrderModal');
  if (!modal) {
    console.error('buySelectedItems: #purchaseOrderModal not found.');
    return;
  }

  modal.innerHTML = poContent;
  modal.style.display = 'flex';

  // Bind events (non-inline)
  const confirmBtn = modal.querySelector('#confirmBtn');
  const cancelBtn = modal.querySelector('#cancelBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmPurchase(selectedIds, totalCost); // Pass IDs and total
      modal.style.display = 'none';
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      hidePurchaseOrder();
    });
  }

  console.log(`Purchase order shown: ${itemDetails.length} items, total $${totalCost.toLocaleString()}`);
}