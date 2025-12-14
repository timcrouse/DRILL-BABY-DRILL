/**
 * @fileoverview Actions/hideModalMessage.js - Message Modal Hider
 * 
 * Purpose: Hides the generic message modal (#modalMessage) by setting display:none
 * and removing .show class if present, returning focus to gameplay. Checks existence
 * to avoid errors; aligns with Shared-Modals.css for consistent toggles. Exported
 * for use in modals and exposed globally in main.js for legacy HTML onclicks.
 * 
 * Key Features:
 * - Targets specific ID for precision.
 * - Silent if modal missing.
 * - Optional .show removal for class-based show/hide.
 * 
 * Changes in Refactor:
 * - Converted from window assignment to ES6 named export (modular).
 * - Added .show class removal (ties to Shared-Modals.css).
 * - Enhanced with logging for debug.
 * - Full JSDoc; no imports needed (pure DOM).
 * - Minor polish: Consistent with other hiders (e.g., hideDeclineConfirm).
 * 
 * Dependencies: None (DOM-based); assumes #modalMessage in index.html.
 * 
 * Usage: import { hideModalMessage } from './hideModalMessage.js';
 * In main.js: window.hideModalMessage = hideModalMessage; // For HTML onclick.
 * Example: hideModalMessage(); // Hides message modal.
 * 
 * @exports {function} hideModalMessage - Hides the message modal.
 */

// Message modal hider
/**
 * Hides the message modal: Sets display:none and removes .show if present.
 * Checks existence to prevent errors.
 */
export function hideModalMessage() {
  const modal = document.getElementById('modalMessage');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show'); // Aligns with Shared-Modals.css
    console.log('Message modal hidden.');
  } else {
    console.warn('hideModalMessage: #modalMessage not found.');
  }
}