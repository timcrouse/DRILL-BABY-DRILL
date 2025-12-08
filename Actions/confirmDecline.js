import { getRandomElement } from './utils.js';

/**
 * Show decline confirmation dialog with a random humorous message
 */
export function confirmDecline() {
  const messages = [
    `Wait... you're about to walk away from risk coverage and efficiency like it's a timeshare in Atlantis? Are you *sure* you want to decline this once-in-a-turn opportunity?`,
    `Act now and we’ll throw in a free sense of regret! Are you *really* passing on this exclusive Turn ${gameState.turn} bundle?`,
    `Skipping insurance and process upgrades? Bold. Very bold. But also… possibly catastrophic. Continue?`,
    `Decline?! Buddy, this deal’s hotter than a blowout sale on refinery-grade duct tape. You sure you wanna walk?`,
    `Warning: Saying no might cause side effects like increased disasters, slower turns, and deep existential doubt.`,
    `And behind Door #1: Peace of mind, operational efficiency, and a sweet PO! Behind Door #2… disappointment. Which do you choose?`
  ];
  const randomMessage = getRandomElement(messages);

  const declineContent = `
    <div class="decline-confirm">
      <h3>Are You Sure?</h3>
      <p style="margin-bottom: 15px;">${randomMessage}</p>
      <div class="buttons">
        <button class="main-btn" title="Return to Purchase Order" onclick="window.hideDeclineConfirm(); window.showTurnModal();">My Bad</button>
        <button class="main-btn" title="Declined like a gym invite in January" onclick="window.hideAllModals(); window.updateTurnButtonLabel();">Decline</button>
      </div>
    </div>
  `;
  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.innerHTML = declineContent;
    declineModal.style.display = 'flex';
  }
}