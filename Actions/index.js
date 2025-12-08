import { updateTurnButtonLabel } from './updateTurnButtonLabel.js';
import { confirmDecline } from './confirmDecline.js';
import { hideDeclineConfirm } from './hideDeclineConfirm.js';
import { hideAllModals } from './hideAllModals.js';
import { makeGeoSurveyReport } from './makeGeoSurveyReport.js';
import { drillWell } from './drillWell.js';
import { setWell } from './setWell.js';
import { geoSurvey } from './geoSurvey.js';
import { showTurnModal } from './showTurnModal.js';
import { nextTurn } from './nextTurn.js';
import { buySelectedItems } from './buySelectedItems.js';
import { confirmPurchase } from './confirmPurchase.js';
import { hidePurchaseOrder } from './hidePurchaseOrder.js';

export {
  updateTurnButtonLabel,
  confirmDecline,
  hideDeclineConfirm,
  hideAllModals,
  makeGeoSurveyReport,
  drillWell,
  setWell,
  geoSurvey,
  showTurnModal,
  nextTurn,
  buySelectedItems,
  confirmPurchase,
  hidePurchaseOrder
};

// Attach to window for browser compatibility (as in original code)
window.buySelectedItems = buySelectedItems;
window.confirmPurchase = confirmPurchase;
window.hidePurchaseOrder = hidePurchaseOrder;
window.showTurnModal = showTurnModal;
window.confirmDecline = confirmDecline;
window.hideDeclineConfirm = hideDeclineConfirm;
window.hideAllModals = hideAllModals;
window.updateTurnButtonLabel = updateTurnButtonLabel;