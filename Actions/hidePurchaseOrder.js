/**
 * @fileoverview Actions/hidePurchaseOrder.js - Purchase Order Modal Hider
 * 
 * Purpose: Hides the purchase order modal (#purchaseOrderModal) by setting display:none
 * and removing .show class if present, then updates the turn button label and shows the
 * turn modal to resume gameplay. Checks existence to avoid errors; aligns with
 * Shared-Modals.css for consistent toggles. Used on cancel/decline flows.
 * 
 * Key Features:
 * - Targets specific ID for precision.
 * - Chains UI updates (hide → label → turn modal) for smooth flow.
 * - Silent if modal missing.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrel (../Actions/index.js).
 * - Added .show class removal (ties to Shared-Modals.css).
 * - Enhanced with validation/logging for debug.
 * - Full JSDoc; no inline globals.
 * - Minor polish: Consistent with other hiders (e.g., hideDeclineConfirm).
 * 
 * Dependencies: updateTurnButtonLabel/showTurnModal from Actions/index.js (via barrel).
 * 
 * Usage: import { hidePurchaseOrder } from './hidePurchaseOrder.js';
 * In main.js: window.hidePurchaseOrder = hidePurchaseOrder; // For HTML onclick.
 * Example: hidePurchaseOrder(); // Hides PO, updates label, shows turn modal.
 * 
 * @exports {function} hidePurchaseOrder - Hides PO modal and resumes turn flow.
 */

// Purchase order modal hider
import { updateTurnButtonLabel, showTurnModal } from '../Actions/index.js'; // Barrel for actions

/**
 * Hides the purchase order modal: Sets display:none, removes .show, updates UI, shows turn modal.
 * Checks existence to prevent errors.
 */
export function hidePurchaseOrder() {
  const poModal = document.getElementById('purchaseOrderModal');
  if (poModal) {
    poModal.style.display = 'none';
    poModal.classList.remove('show'); // Aligns with Shared-Modals.css
    console.log('Purchase order modal hidden.');
  } else {
    console.warn('hidePurchaseOrder: #purchaseOrderModal not found.');
  }

  // Chain UI updates
  updateTurnButtonLabel();
  showTurnModal();

  console.log('Purchase order flow ended: Turn modal shown.');
}