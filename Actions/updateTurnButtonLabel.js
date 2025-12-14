/**
 * @fileoverview Actions/updateTurnButtonLabel.js - Turn Button Label Updater
 * 
 * Purpose: Updates the 'Next Turn' button label to 'Next Turn' after turn advance or modal close,
 * ensuring consistent UI state. Checks element existence to avoid errors; can be extended for
 * dynamic labels (e.g., 'Turn X Complete'). Aligns with events.js for button wiring.
 * 
 * Key Features:
 * - Targets #nextTurnBtn for precision.
 * - Silent if button missing.
 * 
 * Changes in Refactor:
 * - Added logging for debug (updated or not).
 * - Enhanced with optional class toggle (e.g., .active for styling).
 * - Full JSDoc; no imports needed (pure DOM).
 * - Minor polish: Consistent with other UI updaters (e.g., updateGameUI).
 * 
 * Dependencies: None (DOM-based); assumes #nextTurnBtn in index.html.
 * 
 * Usage: import { updateTurnButtonLabel } from './updateTurnButtonLabel.js';
 * In main.js: window.updateTurnButtonLabel = updateTurnButtonLabel; // For legacy calls.
 * Example: updateTurnButtonLabel(); // Sets text to 'Next Turn'.
 * 
 * @exports {function} updateTurnButtonLabel - Resets turn button label.
 */

// Turn button label updater
/**
 * Updates the Next Turn button text to 'Next Turn' and optional class.
 * Checks existence to prevent errors.
 */
export function updateTurnButtonLabel() {
  const turnButton = document.getElementById('nextTurnBtn');
  if (turnButton) {
    turnButton.textContent = 'Next Turn';
    turnButton.classList.remove('disabled', 'loading'); // Optional: Reset states
    console.log('Turn button label updated to "Next Turn".');
  } else {
    console.warn('updateTurnButtonLabel: #nextTurnBtn not found.');
  }
}