import { gameState } from './data.js';
import { updateGameUI, showModalMessage } from './ui.js';
import { showTurnModal } from './showTurnModal.js';
import { updateTurnButtonLabel } from './updateTurnButtonLabel.js';

/** Confirm purchase (attached to window in original) */
export function confirmPurchase(itemIds, totalCost) {
  if (gameState.cash < totalCost) {
    showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
      <h2>Not Enough Cash</h2>
      <p>Not enough cash to complete the purchase.</p>
      <br>
      <button class="main-btn" onclick="window.showTurnModal()">OK</button>
    </div>`);
    window.hidePurchaseOrder();
    return;
  }

  // Apply purchase effects
  itemIds.forEach(id => {
    if (id.includes('ins')) {
      const type = id.replace('ins', '').toLowerCase();
      gameState.insurances[type] = true;
    }
    // Placeholder for process improvement effects
  });

  gameState.cash -= totalCost;
  updateGameUI();
  window.hidePurchaseOrder();
  showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
    <h2>Purchase Confirmed</h2>
    <p>Purchase completed successfully for <span class="yellow-value">$${totalCost.toLocaleString()}</span>.</p>
    <br>
    <button class="main-btn" onclick="window.hideModalMessage(); window.updateTurnButtonLabel();">OK</button>
  </div>`);
}