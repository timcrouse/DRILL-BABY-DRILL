import { gameState, wells } from './data.js';
import { updateGameUI, showModalMessage } from './ui.js';
import { showTurnModal } from './showTurnModal.js';

/** Advance to next turn */
export function nextTurn() {
  // Production from wells
  let production = 0;
  for (let key in wells) {
    if (wells[key].producing) {
      production += wells[key].currentRate;
    }
  }
  gameState.crude += production;

  // Random cash injection
  const amount = Math.floor(Math.random() * 10000) + 5000; // 5000 to 14999
  gameState.cash += amount;

  showTurnModal();

  // Random disaster event (20% chance)
  if (Math.random() < 0.2) {
    let lossMsg = '';
    // Disaster logic...
    if (lossMsg) {
      setTimeout(() => {
        showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
          <h2>Disaster Struck!</h2>
          ${lossMsg}
          <br>
          <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
        </div>`);
      }, 1000);
    }
  }

  // Reset insurances for next turn
  gameState.insurances = { fire: false, flood: false, labor: false };

  // Add this line at the end of the nextTurn() function
  document.querySelectorAll('.insurance-box').forEach(cb => cb.checked = false);

  updateGameUI();
}