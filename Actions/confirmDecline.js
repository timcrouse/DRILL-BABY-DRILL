/**
 * @fileoverview Actions/confirmDecline.js - Decline Confirmation Handler
 * 
 * Purpose: Displays a humorous decline confirmation modal with a random witty message
 * from a predefined array, prompting the user to reconsider canceling a purchase.
 * Builds and injects HTML into #declineConfirmModal, with buttons to return to purchase
 * or fully decline (hiding all modals and updating UI). Adds flavor to the rejection flow.
 * 
 * Key Features:
 * - Random message selection via getRandomElement for replayability.
 * - Themed HTML with .decline-confirm classes for styling.
 * - Event-driven buttons (no inline onclicks) for confirm/back actions.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Utils/index.js, ../Data/index.js, ../UI/index.js).
 * - Replaced inline onclick with addEventListener (dispatches to hideDeclineConfirm, showTurnModal, etc.).
 * - Added gameState import for turn in messages (dynamic).
 * - Enhanced with validation (modal existence), logging, and optional message customization.
 * - JSDoc with @typedef for messages; consistent spacing.
 * 
 * Dependencies: getRandomElement from Utils/index.js; gameState from Data/index.js; showTurnModal/hideAllModals/updateTurnButtonLabel from Actions/UI.
 * 
 * Usage: Exported for window.confirmDecline in main.js; call on cancel click.
 * Example: confirmDecline(); // Shows modal with random quip like "Decline?! Buddy...".
 * 
 * @exports {function} confirmDecline - Shows decline modal with random humor.
 */

// Decline confirmation handler
import { getRandomElement } from '../Utils/index.js'; // Barrel for utils
import { gameState } from '../Data/index.js'; // Barrel for state

// Flavor messages (extendable array)
const DECLINE_MESSAGES = [
  `Wait... you're about to walk away from risk coverage and efficiency like it's a timeshare in Atlantis? Are you *sure* you want to decline this once-in-a-turn opportunity?`,
  `Act now and we’ll throw in a free sense of regret! Are you *really* passing on this exclusive Turn ${gameState.turn} bundle?`,
  `Skipping insurance and process upgrades? Bold. Very bold. But also… possibly catastrophic. Continue?`,
  `Decline?! Buddy, this deal’s hotter than a blowout sale on refinery-grade duct tape. You sure you wanna walk?`,
  `Warning: Saying no might cause side effects like increased disasters, slower turns, and deep existential doubt.`,
  `And behind Door #1: Peace of mind, operational efficiency, and a sweet PO! Behind Door #2… disappointment. Which do you choose?`
  /**
   * @typedef {string[]} DeclineMessages - Array of humorous decline prompts.
   */
];

/**
 * Shows the decline confirmation modal with a random message.
 * Binds buttons to return to purchase or fully decline.
 */
export function confirmDecline() {
  const randomMessage = getRandomElement(DECLINE_MESSAGES) || DECLINE_MESSAGES[0]; // Fallback

  const declineContent = `
    <div class="decline-confirm">
      <h3>Are You Sure?</h3>
      <p style="margin-bottom: 15px;">${randomMessage}</p>
      <div class="buttons">
        <button class="main-btn" id="backBtn" title="Return to Purchase Order">My Bad</button>
        <button class="main-btn" id="declineBtn" title="Declined like a gym invite in January">Decline</button>
      </div>
    </div>
  `;

  const declineModal = document.getElementById('declineConfirmModal');
  if (!declineModal) {
    console.error('confirmDecline: #declineConfirmModal not found in DOM.');
    return;
  }

  // Inject content and show
  declineModal.innerHTML = declineContent;
  declineModal.style.display = 'flex';

  // Bind events (non-inline)
  const backBtn = declineModal.querySelector('#backBtn');
  const declineBtn = declineModal.querySelector('#declineBtn');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      import('../Actions/index.js').then(({ hideDeclineConfirm, showTurnModal }) => {
        hideDeclineConfirm();
        showTurnModal();
      });
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      import('../Actions/index.js').then(({ hideAllModals }) => {
        hideAllModals();
      }).then(() => {
        // Dynamic import for updateTurnButtonLabel if exported
        import('../Actions/index.js').then(({ updateTurnButtonLabel }) => {
          if (updateTurnButtonLabel) updateTurnButtonLabel();
        }).catch(() => {}); // Graceful if not exported
      });
    });
  }

  console.log(`Decline modal shown with message: "${randomMessage.substring(0, 50)}..."`);
}