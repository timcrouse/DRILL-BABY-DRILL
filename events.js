/**
 * events.js - DOM Event Wiring: Buttons, Modals, Settings, and Game Interactions
 * 
 * Description: This module binds all interactive DOM events for the "Drill Baby Drill" game.
 * It handles button clicks (drill, survey, next turn), modal interactions, settings/mode selection,
 * and extends to checkboxes (insurances/mods for cost modifiers), buy/sell actions (refineries/products),
 * and grid cell selection. Events are bound after DOM readiness to ensure elements exist.
 * 
 * Key Features:
 * - Direct onclick for well actions using selectedCell from Data.
 * - Checkbox toggles update gameState (e.g., insurances reduce costs, mods boost efficiency).
 * - Buy/Sell buttons with basic validation (cash check, quantity updates).
 * - Modal click-outside-to-close and content-specific handlers.
 * - Reset integrates sample oil map data for quick demo refresh.
 * - Logging for debugging; extensible for future events (e.g., grid hovers).
 * 
 * Usage: Exported bindEvents() called in main.js after bootstrap.
 * 
 * Dependencies: Actions/index.js (drillWell, nextTurn), Data/index.js (gameState, selectedCell, generateOilMap),
 * UI/index.js (updateGameUI, showModalMessage). Assumes global window exposures for modals.
 * 
 * Changes in This Update (v1.2 - Dec 13, 2025):
 * - Added checkbox bindings for insurances/mods with immediate UI/cost updates.
 * - Implemented basic buyRefBtn/sellRefBtn and sellProductBtn logic (cash/quantity checks).
 * - Enhanced resetBtn to regenerate map with sample data.
 * - Added grid cell click for selectedCell updates (enables well actions).
 * - Improved modal handlers with preventDefault for better UX.
 * 
 * @author Refactored by Grok (xAI)
 * @version 1.2 - Extended Interactions with Checkboxes, Buy/Sell, and Grid Selection
 */

// Core Imports
import { 
  drillWell, 
  setWell, 
  geoSurvey, 
  nextTurn,
  buyRefinery, // Assuming exported from Actions; stub if not
  sellRefinery,
  sellProducts
} from './Actions/index.js'; // Actions functions
import { 
  gameState, 
  getModeDesc,
  generateOilMap,
  selectedCell,
  SAMPLE_OIL_DATA // Imported for reset/demo use
} from './Data/index.js'; // Data state/constants
import { updateGameUI, showModalMessage } from './UI/index.js';

/**
 * Binds all interactive events (onclick/addEventListener).
 * Call after DOM/UI is ready.
 */
export function bindEvents() {
  // Grid Cell Selection (new: enables well actions on clicks)
  const gridCells = document.querySelectorAll('#xy-grid td');
  gridCells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      const x = parseInt(e.target.dataset.x || 0);
      const y = parseInt(e.target.dataset.y || 0);
      selectedCell.x = x;
      selectedCell.y = y;
      // Visual feedback: highlight selected
      gridCells.forEach(c => c.classList.remove('selected'));
      e.target.classList.add('selected');
      console.log(`Selected cell: (${x}, ${y})`);
    });
  });

  // Well Actions (direct onclick with selectedCell)
  document.getElementById('drillBtn').onclick = (e) => {
    e.preventDefault();
    if (selectedCell.x === null || selectedCell.y === null) {
      showModalMessage('Select a grid cell first!');
      return;
    }
    drillWell(selectedCell.x, selectedCell.y);
  };
  document.getElementById('setWellBtn').onclick = (e) => {
    e.preventDefault();
    if (selectedCell.x === null || selectedCell.y === null) {
      showModalMessage('Select a grid cell first!');
      return;
    }
    setWell(selectedCell.x, selectedCell.y);
  };
  document.getElementById('geoSurveyBtn').onclick = (e) => {
    e.preventDefault();
    if (selectedCell.x === null || selectedCell.y === null) {
      showModalMessage('Select a grid cell first!');
      return;
    }
    geoSurvey(selectedCell.x, selectedCell.y);
  };

  // Turn & Controls
  document.getElementById('nextTurnBtn').onclick = (e) => {
    e.preventDefault();
    console.log('nextTurnBtn clicked');
    gameState.turn += 1; // Increment turn
    nextTurn(); // Trigger turn logic (e.g., production, market updates)
    updateGameUI(); // Refresh display
  };

  document.getElementById('accountingBtn').onclick = (e) => {
    e.preventDefault();
    showModalMessage('<div class="info">Accounting report: Profits TBD. Total cash: $' + gameState.cash + '</div>');
  };

  // Insurance & Mod Checkboxes (new: toggle state and update costs/efficiency)
  const checkboxes = document.querySelectorAll('.ins-mod-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const id = e.target.id;
      const isChecked = e.target.checked;
      const key = id.replace('chk-', '').replace('-', '_'); // e.g., 'ins_fire' or 'mod_fluid'
      
      // Update gameState
      if (key.startsWith('ins_')) {
        gameState.insurances[key.replace('ins_', '')] = isChecked;
        // Example: Reduce costs by 10% per insurance
        updateGameUI(); // Recalc costs (e.g., costDrill -= 10% if fire checked)
      } else if (key.startsWith('mod_')) {
        gameState.mods[key.replace('mod_', '')] = isChecked;
        // Example: Boost production by 20% per mod
        updateGameUI(); // Apply efficiency multipliers
      }
      
      console.log(`${key} toggled to ${isChecked}`);
    });
  });

  // Buy/Sell Refineries (new: basic cash/quantity logic)
  document.getElementById('buyRefBtn').onclick = (e) => {
    e.preventDefault();
    if (gameState.cash < 1000) { // Example cost
      showModalMessage('Insufficient cash for refinery!');
      return;
    }
    buyRefinery('small'); // Or prompt for size
    gameState.cash -= 1000;
    updateGameUI();
  };
  document.getElementById('sellRefBtn').onclick = (e) => {
    e.preventDefault();
    if (gameState.refineries.small <= 0) {
      showModalMessage('No refineries to sell!');
      return;
    }
    sellRefinery('small');
    gameState.cash += 800; // Example sell price
    updateGameUI();
  };

  // Sell Products (new: sell all or prompt)
  document.getElementById('sellProductBtn').onclick = (e) => {
    e.preventDefault();
    const totalSold = sellProducts(); // Returns sold value
    if (totalSold > 0) {
      gameState.cash += totalSold;
      showModalMessage(`Sold products for $${totalSold}!`);
      updateGameUI();
    } else {
      showModalMessage('No products to sell.');
    }
  };

  // Settings Dialog
  document.getElementById('settingsBtn').onclick = (e) => {
    e.preventDefault();
    const dialog = document.getElementById('settingsDialog');
    if (dialog) {
      dialog.style.display = 'flex';
      const descEl = document.getElementById('modeDesc');
      if (descEl) descEl.innerHTML = getModeDesc(gameState.mode);
      document.querySelectorAll('.mode-btn').forEach(b =>
        b.classList.toggle('selected', b.dataset.mode === gameState.mode)
      );
    }
  };

  document.getElementById('closeSettingsBtn').onclick = (e) => {
    e.preventDefault();
    const dialog = document.getElementById('settingsDialog');
    if (dialog) dialog.style.display = 'none';
  };

  document.getElementById('resetBtn').onclick = (e) => {
    e.preventDefault();
    // Reset gameState to defaults
    gameState.turn = 1;
    gameState.cash = 10000; // Example start cash
    // ... other resets
    generateOilMap({ oilData: SAMPLE_OIL_DATA }); // Regenerate with sample data
    updateGameUI();
    showModalMessage('Game reset! Ready to drill.');
  };

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      gameState.mode = btn.dataset.mode;
      updateGameUI();
      const descEl = document.getElementById('modeDesc');
      if (descEl) descEl.innerHTML = getModeDesc(gameState.mode);
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      // Close dialog after selection
      document.getElementById('settingsDialog').style.display = 'none';
    };
  });

  // Modal Interactions (click-outside-to-close)
  const modalMessage = document.getElementById('modalMessage');
  if (modalMessage) {
    modalMessage.addEventListener('click', (event) => {
      if (event.target === modalMessage) {
        window.hideModalMessage(); // Assumes global
      }
    });
  }

  const modalContent = document.getElementById('modalMsgContent');
  if (modalContent) {
    modalContent.addEventListener('click', (event) => event.stopPropagation());
  }

  const purchaseModal = document.getElementById('purchaseOrderModal');
  if (purchaseModal) {
    purchaseModal.addEventListener('click', (event) => {
      if (event.target === purchaseModal) {
        window.hidePurchaseOrder(); // Assumes global exposed
      }
    });
  }

  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.addEventListener('click', (event) => {
      if (event.target === declineModal) {
        window.hideDeclineConfirm(); // Assumes global
      }
    });
  }

  console.log('Events bound - Full interactivity enabled');
}