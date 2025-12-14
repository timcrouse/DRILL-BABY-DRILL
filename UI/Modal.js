/**
 * @fileoverview UI/Modal.js - Modal Dialog Handler
 * 
 * Purpose: Manages generic and specialized modal dialogs for messages, geo reports, and other
 * UI notifications. Handles showing/hiding modals by injecting HTML content and toggling display.
 * Supports global exposure for HTML onclick handlers and specialized wrappers (e.g., geo reports).
 * 
 * Key Features:
 * - Generic show/hide for any HTML content.
 * - Auto-finds modal elements (#modalMessage, #modalMsgContent) on first use.
 * - Specialized showGeoReport with container and close button.
 * - Logging for debugging (e.g., HTML length on show).
 * - Global exposure of hideModal for legacy HTML bindings.
 * 
 * Changes in Refactor:
 * - No imports needed (DOM-based); self-contained for UI/.
 * - Lazy initialization of modal elements to avoid early errors.
 * - Renamed/aliased exports for consistency with main.js imports:
     - showModal → showModalMessage (takes HTML, wraps in message class if needed).
     - hideModal → hideModalMessage.
   - Added try-catch for resilience and better error messages.
 * - Improved console logs with context (e.g., 'Modal shown').
 * - Ensured close button in showGeoReport uses window.hideModalMessage (global).
 * 
 * Dependencies: Assumes #modalMessage and #modalMsgContent exist in index.html.
 * CSS for .geo-report-container and .main-btn.
 * 
 * Usage: Import via UI/index.js barrel (e.g., { showModalMessage } from './UI/index.js').
 * Call showModalMessage('<div>Content</div>'); or showGeoReport(html).
 * Exported functions aliased in barrel for main.js compatibility.
 * 
 * @exports {function} showModalMessage - Shows modal with HTML content.
 * @exports {function} hideModalMessage - Hides the modal.
 * @exports {function} showGeoReport - Shows geo report in modal with close button.
 */

// Lazy refs to modal elements (init on first use)
let _modal = null;
let _content = null;

/**
 * Initializes modal elements if not already done.
 * @private
 */
function initModalElements() {
  if (!_modal) _modal = document.getElementById('modalMessage');
  if (!_content) _content = document.getElementById('modalMsgContent');
  if (!_modal || !_content) {
    throw new Error('Modal elements (#modalMessage, #modalMsgContent) not found in DOM');
  }
}

/**
 * Shows the modal with provided HTML content.
 * @param {string} html - HTML to inject into modal content.
 */
export function showModalMessage(html) {
  try {
    initModalElements();
    console.log('showModalMessage called with html length:', html?.length || 0);
    _content.innerHTML = `<div class="message">${html}</div>`; // Wrap in .message for styling
    _modal.style.display = 'flex';
    console.log('Modal shown');
  } catch (error) {
    console.error('Error showing modal:', error);
    // Fallback: Alert if modal DOM missing
    if (error.message.includes('not found')) {
      alert(`Modal error: ${html.substring(0, 100)}...`);
    }
  }
}

/**
 * Hides the modal.
 */
export function hideModalMessage() {
  try {
    initModalElements();
    console.log('hideModalMessage called');
    _modal.style.display = 'none';
    console.log('Modal hidden');
  } catch (error) {
    console.error('Error hiding modal:', error);
  }
}

// Expose to global scope for HTML onclick (e.g., <button onclick="hideModalMessage()">)
window.hideModalMessage = hideModalMessage;

/**
 * Shows a specialized geo-report modal with container and close button.
 * @param {string} htmlReport - HTML content for the geo report.
 */
export function showGeoReport(htmlReport) {
  try {
    const closeBtn = `<button class="main-btn" onclick="hideModalMessage()">Close</button>`;
    const content = `
      <div class="geo-report-container">
        ${htmlReport}
      </div>
      ${closeBtn}
    `;
    showModalMessage(content);
  } catch (error) {
    console.error('Error showing geo report:', error);
  }
}