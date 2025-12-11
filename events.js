// events.js - DOM event wiring: Buttons, modals, settings

import { 
  drillWell, 
  setWell, 
  geoSurvey, 
  nextTurn, 
  gameState, 
  getModeDesc,
  generateOilMap 
} from './Data/index.js'; // For selectedCell, etc.
import { updateGameUI, showModalMessage } from './UI/index.js';
import { selectedCell } from './Data/index.js'; // Direct for bindings

/**
 * Binds all interactive events (onclick/addEventListener).
 * Call after DOM/UI is ready.
 */
export function bindEvents() {
  // Well Actions (direct onclick with selectedCell, from original)
  document.getElementById('drillBtn').onclick = () => drillWell(selectedCell.x, selectedCell.y);
  document.getElementById('setWellBtn').onclick = () => setWell(selectedCell.x, selectedCell.y);
  document.getElementById('geoSurveyBtn').onclick = () => geoSurvey(selectedCell.x, selectedCell.y);

  // Turn & Controls
  document.getElementById('nextTurnBtn').onclick = () => {
    console.log('nextTurnBtn clicked');
    gameState.turn += 1; // From original
    nextTurn();
  };

  document.getElementById('accountingBtn').onclick = () => showModalMessage('Accounting coming soon');

  // Settings Dialog
  document.getElementById('settingsBtn').onclick = () => {
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

  document.getElementById('closeSettingsBtn').onclick = () => {
    const dialog = document.getElementById('settingsDialog');
    if (dialog) dialog.style.display = 'none';
  };

  document.getElementById('resetBtn').onclick = () => {
    generateOilMap();
    updateGameUI();
  };

  // Mode buttons (from original)
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.onclick = () => {
      gameState.mode = btn.dataset.mode;
      updateGameUI();
      const descEl = document.getElementById('modeDesc');
      if (descEl) descEl.innerHTML = getModeDesc(gameState.mode);
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });

  // Modal Interactions (addEventListener, from original)
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

  console.log('Events bound');
}