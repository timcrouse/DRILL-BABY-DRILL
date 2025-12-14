/**
 * @fileoverview Actions/showTurnModal.js - Turn Options Modal Display
 * 
 * Purpose: Shows the turn modal with insurance/process improvement checkboxes, capital injection
 * display (current cash + random reason), and Buy/Decline buttons. Generates dynamic HTML
 * for the modal content, including disabled states for insurances (if already set, but reset per turn).
 * Binds buttons post-render to buySelectedItems/confirmDecline for flow control.
 * 
 * Key Features:
 * - Sections: Capital injection (cash + flavored reason), insurances, process improvements.
 * - Checkboxes with custom classes; onclick stopPropagation to prevent modal close.
 * - Hardcoded costs (future: pull from config); turn-specific note.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../Utils/index.js, ../UI/index.js, ../Actions/index.js).
 * - Replaced inline onclick with setTimeout-bound addEventListener (avoids globals; dynamic import for buySelectedItems/confirmDecline).
 * - Broke HTML into helpers (capitalSection, insuranceSection, etc.) for readability.
 * - Added validation (gameState.mode for reason) and logging.
 * - Enhanced JSDoc; consistent template literals, toLocaleString for cash.
 * - Minor polish: getRandomElement for reason; future-proof for dynamic costs.
 * 
 * Dependencies: gameState/cashReasons from Data/index.js; getRandomElement from Utils/index.js; showModalMessage from UI/index.js; buySelectedItems/confirmDecline from Actions/index.js.
 * 
 * Usage: import { showTurnModal } from './showTurnModal.js'; // Called from nextTurn/hidePurchaseOrder.
 * Example: showTurnModal(); // Injects modal HTML, binds Buy to purchase flow.
 * 
 * @exports {function} showTurnModal - Displays turn options modal with bindings.
 */

// Turn modal display
import { gameState, cashReasons } from '../Data/index.js'; // Barrel for data
import { getRandomElement } from '../Utils/index.js'; // Barrel for utils
import { showModalMessage } from '../UI/index.js'; // Barrel for UI
import { buySelectedItems, confirmDecline } from '../Actions/index.js'; // Barrel for actions

const INSURANCE_COST = 2000;
const PROCESS_COST = 3000;
const WELL_COST_PER = 100;
const REFINERY_COST_PER = 200;
const PROCESS_WELL_BONUS = 150;
const PROCESS_REFINERY_BONUS = 150;

/**
 * Builds the capital injection section HTML.
 * @returns {string} Section HTML.
 */
function capitalSection() {
  const amount = gameState.cash;
  const modeReasons = cashReasons[gameState.mode] || cashReasons.CEO;
  const reason = getRandomElement(modeReasons);
  return `
    <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
      <hr style="border: none; border-top: 1px solid #b1d1ee99; margin: 16px 0 8px;">
      <div class="section-title">Capital Injection</div>
      <div style="margin-bottom: 10px;">
        <span>Amount: <span class="yellow-value">$${amount.toLocaleString()}</span></span>
        <p style="margin: 4px 0 0;">${reason}</p>
      </div>
    </div>
  `;
}

/**
 * Builds the insurance section HTML.
 * @returns {string} Section HTML with checkboxes.
 */
function insuranceSection() {
  const insurances = ['fire', 'flood', 'labor'];
  const rows = insurances.map(type => {
    const id = `ins${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const checked = gameState.insurances[type] ? 'disabled' : '';
    return `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span><span class="insurance-label">${type.charAt(0).toUpperCase() + type.slice(1)}</span> - Cost: <span class="yellow-value">$${INSURANCE_COST}</span> - (<span class="yellow-value">$${WELL_COST_PER}</span>/Well, <span class="yellow-value">$${REFINERY_COST_PER}</span>/Refinery)</span>
        <input type="checkbox" class="custom-checkbox insurance-box" id="${id}" ${checked}>
      </div>
    `;
  }).join('');

  return `
    <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
      <div class="section-title">Turn Insurances</div>
      ${rows}
    </div>
  `;
}

/**
 * Builds the process improvement section HTML.
 * @returns {string} Section HTML with checkboxes.
 */
function processSection() {
  const processes = [
    { id: 'procCrude', label: 'Crude Oil Flow Optimization', bonus: `$${PROCESS_WELL_BONUS}/Well` },
    { id: 'procRef', label: 'Refinery Process Improvement', bonus: `$${PROCESS_REFINERY_BONUS}/Refinery` },
    { id: 'procGeo', label: 'Geological Survey Modernization', bonus: '' }
  ];
  const rows = processes.map(proc => `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${proc.label}, Cost: <span class="yellow-value">$${PROCESS_COST}</span> - (${proc.bonus})</span>
      <input type="checkbox" class="custom-checkbox" id="${proc.id}">
    </div>
  `).join('');

  return `
    <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
      <div class="section-title">Process Improvement</div>
      ${rows}
    </div>
  `;
}

/**
 * Binds modal buttons post-render (Buy/Decline).
 */
function bindTurnModalButtons() {
  setTimeout(() => {
    const buyBtn = document.querySelector('#modalMsgContent .main-btn[onclick*="buySelectedItems"]');
    const declineBtn = document.querySelector('#modalMsgContent .main-btn[onclick*="confirmDecline"]');
    if (buyBtn) {
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        buySelectedItems();
      }, { once: true });
      buyBtn.removeAttribute('onclick'); // Clean up if present
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDecline();
      }, { once: true });
      declineBtn.removeAttribute('onclick');
    }
  }, 50);
}

/**
 * Shows the turn modal with options for insurance/process purchases.
 */
export function showTurnModal() {
  const modalContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Turn ${gameState.turn} Insurance and Process Improvement Options</h2>
      ${capitalSection()}
      <br>
      ${insuranceSection()}
      <br>
      ${processSection()}
      <br>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="main-btn" id="buyTurnBtn">Buy</button>
        <button class="main-btn" id="declineTurnBtn">Decline</button>
      </div>
      <br><br>
      <div class="turn-note">
        NOTE: Turn ${gameState.turn} Insurance and Work-Flow Process Improvement options are only available through this Purchase Order and must be confirmed or declined to move forward with Turn ${gameState.turn} operations. Failure to respond will result in these modernizations being automatically declined for the current turn.
      </div>
    </div>
  `;

  showModalMessage(modalContent);
  bindTurnModalButtons();

  console.log(`Turn ${gameState.turn} modal shown with options.`);
}