/* actions.js */
import { gameState, oilMap, wells, geoReports, cashReasons, lossReasons } from './data.js';
import { getCostsByMode }                    from './data.js';
import { getRandomElement } from './utils.js';
import { updateGameUI, showModalMessage }    from './ui.js';

/**
 * Update the turn button label to "Next Turn"
 */
function updateTurnButtonLabel() {
  const turnButton = document.getElementById('nextTurnBtn');
  if (turnButton) {
    turnButton.textContent = 'Next Turn';
  }
}

/**
 * Show decline confirmation dialog with a random humorous message
 */
function confirmDecline() {
  const messages = [
    `Wait... you're about to walk away from risk coverage and efficiency like it's a timeshare in Atlantis? Are you *sure* you want to decline this once-in-a-turn opportunity?`,
    `Act now and we’ll throw in a free sense of regret! Are you *really* passing on this exclusive Turn ${gameState.turn} bundle?`,
    `Skipping insurance and process upgrades? Bold. Very bold. But also… possibly catastrophic. Continue?`,
    `Decline?! Buddy, this deal’s hotter than a blowout sale on refinery-grade duct tape. You sure you wanna walk?`,
    `Warning: Saying no might cause side effects like increased disasters, slower turns, and deep existential doubt.`,
    `And behind Door #1: Peace of mind, operational efficiency, and a sweet PO! Behind Door #2… disappointment. Which do you choose?`
  ];
  const randomMessage = getRandomElement(messages);

  const declineContent = `
    <div class="decline-confirm">
      <h3>Are You Sure?</h3>
      <p style="margin-bottom: 15px;">${randomMessage}</p>
      <div class="buttons">
        <button class="main-btn" title="Return to Purchase Order" onclick="window.hideDeclineConfirm(); window.showTurnModal();">My Bad</button>
        <button class="main-btn" title="Declined like a gym invite in January" onclick="window.hideAllModals(); window.updateTurnButtonLabel();">Decline</button>
      </div>
    </div>
  `;
  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.innerHTML = declineContent;
    declineModal.style.display = 'flex';
  }
}

/**
 * Hide the decline confirmation modal
 */
function hideDeclineConfirm() {
  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.style.display = 'none';
  }
}

/**
 * Hide all modals to return to gameplay
 */
function hideAllModals() {
  document.getElementById('modalMessage').style.display = 'none';
  document.getElementById('purchaseOrderModal').style.display = 'none';
  document.getElementById('declineConfirmModal').style.display = 'none';
}

/**
 * Build the detailed Geo-Survey report HTML (V22 style)
 */
function makeGeoSurveyReport(x, y, info, mode) {
  const row = (label, val) =>
    `<div class="geo-report-row"><span class="geo-report-label">${label}</span> <span class="geo-report-value">${val}</span></div>`;

  let html = `
    <div class="geo-report-container">
      <div class="geo-report-title">GeoSurvey Report - Grid (${x}, ${y})</div>
  `;

  if (!info.hasOil) {
    html += row("Seismic Reflection:", "Weak");
    html += row("Gravity Anomaly:",    "None");
    html += row("Hydrocarbon Shows:",  "Not detected");
    html += `
      <hr class="geo-report-hr">
      <div class="geo-report-conclusion">Conclusion: No significant petroleum indicators detected.</div>
      <div class="geo-report-note">Note: Subsurface appears non-prospective at depths surveyed.</div>
      <button class="main-btn" onclick="window.hideModalMessage()">Close</button>
    </div>`;
    return html;
  }

  // Oil-present case
  const minD     = info.minDepth  || 3000 + Math.floor(Math.random()*4000);
  const maxD     = info.maxDepth  || minD + 3000 + Math.floor(Math.random()*3000);
  const peak     = info.prodPeak  || 100 + Math.floor(Math.random()*100);
  const chance   = mode==='Engineer'?88:mode==='CEO'?70:55;
  const variance = mode==='Engineer'?6:mode==='CEO'?12:20;

  html += row("Seismic Reflection:",   "Strong");
  html += row("Gravity Anomaly:",      "Positive");
  html += row("Hydrocarbon Shows:",    "Present");
  html += row("Estimated Payzone Depth:", `${minD.toLocaleString()} - ${maxD.toLocaleString()} ft`);
  html += row("Peak Production Estimate:", `${peak} - ${peak+variance} barrels/turn`);

  html += `
      <hr class="geo-report-hr">
      <div class="geo-report-summary">Chance of Success: ${chance}%</div>
      <div class="geo-report-summary">Summary: Subsurface structure is promising for commercial oil accumulation.</div>
      <div class="geo-report-note">This report is based on seismic, gravity, and geochemical indicators. (Actual drilling results may vary!)</div>
      <button class="main-btn" onclick="window.hideModalMessage()">Close</button>
    </div>`;
  return html;
}

/** Drill action */
export function drillWell(x,y) {
  const costs = getCostsByMode();
  if (gameState.cash < costs.drill) return;
  gameState.cash -= costs.drill;

  const key = `${x},${y}`;
  if (!wells[key]) wells[key] = { drilled:false, depth:0, well:false, producing:false, currentRate:0 };
  wells[key].drilled = true;
  wells[key].depth  += 1000;

  const info = oilMap[y-1][x-1];
  if (info.hasOil && wells[key].depth >= 2000) {
    wells[key].producing  = true;
    wells[key].currentRate = Math.floor(wells[key].depth/100);
  }

  updateGameUI();
}

/** Set Well action */
export function setWell(x,y) {
  const costs = getCostsByMode();
  const key   = `${x},${y}`;
  if (!wells[key]?.drilled || gameState.cash < costs.setWell) return;
  gameState.cash -= costs.setWell;
  wells[key].well = true;
  updateGameUI();
}

/** Geo Survey action – now generates full report */
export function geoSurvey(x,y) {
  const costs = getCostsByMode();
  if (gameState.cash < costs.survey) {
    showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
      <h2>Not Enough Cash</h2>
      <p>Not enough cash for a geo survey.</p>
      <br>
      <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
    </div>`);
    return;
  }
  gameState.cash -= costs.survey;

  const key  = `${x},${y}`;
  const info = oilMap[y-1][x-1] || {};
  // store the rich HTML report
  geoReports[key] = makeGeoSurveyReport(x, y, info, gameState.mode);

  showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
    <h2>Geo Survey Complete</h2>
    <p>Geo survey complete! Click GEO REPORT to view the details.</p>
    <br>
    <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
  </div>`);
  updateGameUI();
}

/** Show Turn Modal */
function showTurnModal() {
  const amount = gameState.cash; // Use current cash for display
  const reason = getRandomElement(cashReasons[gameState.mode]);

  const modalContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Turn ${gameState.turn} Insurance and Process Improvement Options</h2>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <hr style="border: none; border-top: 1px solid #b1d1ee99; margin: 16px 0 8px;">
        <div class="section-title">Capital Injection</div>
        <div style="margin-bottom: 10px;">
          <span>Amount: <span class="yellow-value">$${amount.toLocaleString()}</span></span>
          <p style="margin: 4px 0 0;">${reason}</p>
        </div>
      </div>
      <br>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <div class="section-title">Turn Insurances</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Fire</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insFire" onclick="event.stopPropagation();" ${gameState.insurances.fire ? 'disabled' : ''}>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Flood</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insFlood" onclick="event.stopPropagation();" ${gameState.insurances.flood ? 'disabled' : ''}>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Labor</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insLabor" onclick="event.stopPropagation();" ${gameState.insurances.labor ? 'disabled' : ''}>
        </div>
      </div>
      <br>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <div class="section-title">Process Improvement</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Crude Oil Flow Optimization, Cost: <span class="yellow-value">$3000</span> - (<span class="yellow-value">$150</span>/Well)</span>
          <input type="checkbox" class="custom-checkbox" id="procCrude" onclick="event.stopPropagation();">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Refinery Process Improvement, Cost: <span class="yellow-value">$3000</span> - (<span class="yellow-value">$150</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="procRef" onclick="event.stopPropagation();">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Geological Survey Modernization, Cost: <span class="yellow-value">$3000</span></span>
          <input type="checkbox" class="custom-checkbox" id="procGeo" onclick="event.stopPropagation();">
        </div>
      </div>
      <br>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="main-btn" onclick="window.buySelectedItems(); event.stopPropagation();">Buy</button>
        <button class="main-btn" onclick="window.confirmDecline();">Decline</button>
      </div>
      <br><br>
      <div class="turn-note" style="color: #f7d860; text-align: left; margin-top: 2em; margin-bottom: 1em;">
        NOTE: Turn ${gameState.turn} Insurance and Work-Flow Process Improvement options are only available through this Purchase Order and must be confirmed or declined to move forward with Turn ${gameState.turn} operations. Failure to respond will result in these modernizations being automatically declined for the current turn.
      </div>
    </div>
  `;
  showModalMessage(modalContent);
}

/** Advance to next turn */
export function nextTurn() {
  // Production from wells
  let production = 0;
  for (let key in wells) {
    if (wells[key].producing) {
      production += wells[key].currentRate;
    }
  }
  gameState.crude += production;

  // Random cash injection
  const amount = Math.floor(Math.random() * 10000) + 5000; // 5000 to 14999
  gameState.cash += amount;

  showTurnModal();

  // Random disaster event (20% chance)
  if (Math.random() < 0.2) {
    let lossMsg = '';
    // Disaster logic...
    if (lossMsg) {
      setTimeout(() => {
        showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
          <h2>Disaster Struck!</h2>
          ${lossMsg}
          <br>
          <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
        </div>`);
      }, 1000);
    }
  }

  // Reset insurances for next turn
  gameState.insurances = { fire: false, flood: false, labor: false };

  // Add this line at the end of the nextTurn() function
  document.querySelectorAll('.insurance-box').forEach(cb => cb.checked = false);

  updateGameUI();
}




window.buySelectedItems = function() {
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
};

window.confirmPurchase = function(itemIds, totalCost) {
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
};

window.hidePurchaseOrder = function() {
  document.getElementById('purchaseOrderModal').style.display = 'none';
  updateTurnButtonLabel();
  showTurnModal();
};

window.showTurnModal = showTurnModal;

window.confirmDecline = confirmDecline;

window.hideDeclineConfirm = hideDeclineConfirm;

window.hideAllModals = hideAllModals;

window.updateTurnButtonLabel = updateTurnButtonLabel;