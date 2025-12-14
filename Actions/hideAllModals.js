/**
 * @fileoverview Actions/hideAllModals.js - Global Modal Hider
 * 
 * Purpose: Hides all active modals (message, purchase, decline confirm) by setting display:none
 * or removing .show class, returning focus to the main gameplay UI. Robustly checks element
 * existence to avoid errors; can be extended for more modals. Used post-action or on cancel.
 * 
 * Key Features:
 * - Targets specific modal IDs for precision.
 * - Silent fallback if elements missing (no crashes).
 * - Consistent with Shared-Modals.css (.show toggle alternative).
 * 
 * Changes in Refactor:
 * - Added existence checks with querySelector for resilience.
 * - Optional .show class removal (aligns with overlay styles; comment if unused).
 * - Enhanced JSDoc; console log for debug (e.g., count hidden).
 * - Minor polish: No imports needed; future-proof array of IDs.
 * 
 * Dependencies: None (DOM-based); assumes modal IDs in index.html.
 * 
 * Usage: import { hideAllModals } from './hideAllModals.js';
 * Example: hideAllModals(); // Hides all three modals.
 * 
 * @exports {function} hideAllModals - Hides all game modals.
 */

// Global modal hider
const MODAL_IDS = [
  'modalMessage',
  'purchaseOrderModal',
  'declineConfirmModal'
  // Add more IDs here for extension (e.g., 'settingsDialog')
];

/**
 * Hides all modals by ID: Sets display:none and removes .show class if present.
 * Checks existence to prevent errors.
 */
export function hideAllModals() {
  let hiddenCount = 0;
  MODAL_IDS.forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show'); // Aligns with Shared-Modals.css if used
      hiddenCount++;
    }
  });

  if (hiddenCount > 0) {
    console.log(`hideAllModals: Hid ${hiddenCount} modal(s).`);
  } else {
    console.warn('hideAllModals: No modals found to hide.');
  }
}