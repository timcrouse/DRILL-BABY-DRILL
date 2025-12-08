import { gameState } from './data.js';
import { showModalMessage } from './ui.js';
import { showTurnModal } from './showTurnModal.js';

/** Buy selected items (attached to window in original) */
export function buySelectedItems() {
  const selectedItems = [];
  const checkboxes = document.querySelectorAll('#modalMsgContent input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    selectedItems.push(checkbox.id);
  });
  if (selectedItems.length === 0) {
    showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
      <h2>No Items Selected</h2>
      <p>Please select at least one item to purchase.</p>
      <br>
      <button class="main-btn" onclick="window.showTurnModal()">OK</button>
    </div>`);
    return;
  }

  const itemDetails = selectedItems.map(id => {
    let name, cost;
    switch (id) {
      case 'insFire': name = 'Fire Insurance'; cost = 2000; break;
      case 'insFlood': name = 'Flood Insurance'; cost = 2000; break;
      case 'insLabor': name = 'Labor Insurance'; cost = 2000; break;
      case 'procCrude': name = 'Crude Oil Flow Optimization'; cost = 3000; break;
      case 'procRef': name = 'Refinery Process Improvement'; cost = 3000; break;
      case 'procGeo': name = 'Geological Survey Modernization'; cost = 3000; break;
    }
    return { name, cost, id };
  });

  const totalCost = itemDetails.reduce((sum, item) => sum + item.cost, 0);
  const itemsList = itemDetails.map(item => `<div>${item.name}: <span class="yellow-value">$${item.cost.toLocaleString()}</span></div>`).join('');

  const poContent = `
    <div class="purchase-order">
      <h3>Turn ${gameState.turn} Purchase Order – Insurance Risk Management & Workflow Modernization</h3>
      <div style="margin-bottom: 10px;">${itemsList}</div>
      <p>Total Cost: <span class="yellow-value">$${totalCost.toLocaleString()}</span></p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Order ID: #${Math.floor(Math.random() * 1000000)}</p>
      <div class="buttons">
        <button class="main-btn" onclick="window.confirmPurchase([${itemDetails.map(item => `'${item.id}'`)}], ${totalCost})">Confirm</button>
        <button class="main-btn" onclick="window.hidePurchaseOrder()">Cancel</button>
      </div>
    </div>
  `;
  document.getElementById('purchaseOrderModal').innerHTML = poContent;
  document.getElementById('purchaseOrderModal').style.display = 'flex';
}