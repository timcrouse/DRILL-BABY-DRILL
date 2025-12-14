/**
 * @fileoverview Actions/hideDeclineConfirm.js - Decline Modal Hider
 * 
 * Purpose: Hides the decline confirmation modal (#declineConfirmModal) by setting display:none
 * or removing .show class, returning to the previous modal or gameplay. Checks existence
 * to avoid errors; aligns with Shared-Modals.css for consistent show/hide patterns.
 * Used on "My Bad" button in confirmDecline to back out gracefully.
 * 
 * Key Features:
 * - Targets specific ID for precision.
 * - Silent if modal missing (no crashes).
 * - Optional .show removal for class-based toggles.
 * 
 * Changes in Refactor:
 * - Added .show class removal (ties to Shared-Modals.css).
 * - Enhanced with logging for debug (hidden or not).
 * - Full JSDoc; no imports needed (pure DOM).
 * - Minor polish: Consistent with hideAllModals pattern.
 * 
 * Dependencies: None (DOM-based); assumes #declineConfirmModal in index.html.
 * 
 * Usage: import { hideDeclineConfirm } from './hideDeclineConfirm.js';
 * Example: hideDeclineConfirm(); // Hides decline modal.
 * 
 * @exports {function} hideDeclineConfirm - Hides the decline confirmation modal.
 */

// Decline modal hider
/**
 * Hides the decline confirmation modal: Sets display:none and removes .show if present.
 * Checks existence to prevent errors.
 */
export function hideDeclineConfirm() {
  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.style.display = 'none';
    declineModal.classList.remove('show'); // Aligns with Shared-Modals.css
    console.log('Decline confirmation modal hidden.');
  } else {
    console.warn('hideDeclineConfirm: #declineConfirmModal not found.');
  }
}