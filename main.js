// main.js - App entry point: Orchestrates init and events (modular version)

import { 
  selectedCell, 
  generateOilMap, 
  gameState, 
  getModeDesc 
} from './Data/index.js';
import { 
  renderGrid, 
  updateGameUI, 
  showModalMessage, 
  hideModalMessage 
} from './UI/index.js';
import { 
  drillWell, 
  setWell, 
  geoSurvey, 
  nextTurn,
  showTurnModal,
  buySelectedItems,
  confirmPurchase,
  confirmDecline,
  hidePurchaseOrder,
  hideDeclineConfirm,
  hideAllModals
} from './Actions/index.js';
import { loadAllStyles } from './Style/index.js';
import { getRandomElement } from './Utils/index.js';

// Init and events (modular)
import { bootstrap } from './init.js';
import { bindEvents } from './events.js';

// Expose globals for HTML onclick (as in original)
window.showModalMessage = showModalMessage;
window.hideModalMessage = hideModalMessage;
window.showTurnModal = showTurnModal;
window.buySelectedItems = buySelectedItems;
window.confirmPurchase = confirmPurchase;
window.confirmDecline = confirmDecline;
window.hidePurchaseOrder = hidePurchaseOrder;
window.hideDeclineConfirm = hideDeclineConfirm;
window.hideAllModals = hideAllModals;
window.updateTurnButtonLabel = () => {}; // From actions if exported

// Onload: Chain modular init
window.onload = async () => {
  console.log('window.onload triggered');
  await bootstrap(); // Handles styles, data, UI, checkboxes
  bindEvents(); // Wires interactions
};

// Export for root index.js barrel
//export { initApp }; // Optional: Alias to bootstrap if needed