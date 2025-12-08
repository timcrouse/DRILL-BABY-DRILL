import { showTurnModal } from './showTurnModal.js';
import { updateTurnButtonLabel } from './updateTurnButtonLabel.js';

/** Hide purchase order (attached to window in original) */
export function hidePurchaseOrder() {
  document.getElementById('purchaseOrderModal').style.display = 'none';
  updateTurnButtonLabel();
  showTurnModal();
}