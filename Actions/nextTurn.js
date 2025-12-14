/**
 * @fileoverview Actions/nextTurn.js - Turn Advancement Handler
 * 
 * Purpose: Advances the game turn: Increments turn counter, calculates well production
 * (adds to crude), injects random cash (5k-15k), shows turn modal, triggers 20% disaster
 * chance with loss messages/flavor, resets insurances/checkboxes, and updates UI.
 * Integrates events for narrative (e.g., cash reasons from modes.js).
 * 
 * Key Features:
 * - Production sum from producing wells.
 * - Random cash with mode-flavored message (via getRandomCashReason).
 * - Disaster: 20% chance with random loss (crude/products/refineries) and flavor text.
 * - Resets insurances to false; unchecks DOM boxes.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js, ../Actions/index.js).
 * - Added missing gameState.turn += 1;.
 * - Fleshed out disaster: Random loss type/amount from lossReasons; deducts crude/cash/products.
 * - Used getRandomCashReason for flavored cash modal (shows after turn modal).
 * - Replaced inline onclick with addEventListener in showDisasterModal helper.
 * - Enhanced validation/logging; JSDoc with @typedef.
 * - Minor polish: Constants for chances/amounts, Object.values for wells loop.
 * 
 * Dependencies: gameState/wells from Data/index.js; updateGameUI/showModalMessage from UI/index.js; showTurnModal/getRandomCashReason/lossReasons from Actions/modes.js.
 * 
 * Usage: import { nextTurn } from './nextTurn.js'; // Bound to nextTurnBtn.onclick.
 * Example: nextTurn(); // Turn++, +crude from wells, +random cash, 20% disaster, UI refresh.
 * 
 * @exports {function} nextTurn - Advances turn with production/events/UI.
 */

// Turn advancement handler
import { gameState, wells } from '../Data/index.js'; // Barrel for data
import { updateGameUI, showModalMessage } from '../UI/index.js'; // Barrel for UI
import { showTurnModal } from '../Actions/index.js'; // Barrel for actions
import { getRandomCashReason, lossReasons } from '../Data/index.js'; // Barrel for modes (Data/)

const DISASTER_CHANCE = 0.2;
const MIN_CASH_INJECT = 5000;
const MAX_CASH_INJECT = 15000;
const DISASTER_AMOUNTS = { crude: 0.2, products: 0.3, refineries: 1 }; // % loss or count

/**
 * Helper to show disaster modal with bound OK button.
 * @param {string} msg - Loss message.
 */
function showDisasterModal(msg) {
  const disasterContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Disaster Struck!</h2>
      ${msg}
      <br>
      <button class="main-btn" id="disasterOkBtn">OK</button>
    </div>
  `;

  showModalMessage(disasterContent);

  // Bind OK post-render
  setTimeout(() => {
    const okBtn = document.querySelector('#modalMsgContent #disasterOkBtn');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
      }, { once: true });
    }
  }, 50);
}

/**
 * Advances to the next turn: Production, cash inject, events, UI update.
 */
export function nextTurn() {
  // Increment turn
  gameState.turn += 1;

  // Production from wells
  let production = 0;
  Object.values(wells).forEach(well => {
    if (well.producing) {
      production += well.currentRate;
    }
  });
  gameState.crude += production;
  console.log(`Turn ${gameState.turn}: Produced ${production} bbl crude.`);

  // Random cash injection with flavor
  const cashAmount = Math.floor(Math.random() * (MAX_CASH_INJECT - MIN_CASH_INJECT + 1)) + MIN_CASH_INJECT;
  gameState.cash += cashAmount;
  const cashReason = getRandomCashReason(gameState.mode);
  console.log(`Cash inject: +$${cashAmount.toLocaleString()} (${cashReason})`);

  // Show turn modal
  showTurnModal();

  // Delayed cash flavor modal (after turn modal)
  setTimeout(() => {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Cash Windfall!</h2>
        <p>+<span class="yellow-value">$${cashAmount.toLocaleString()}</span></p>
        <p>${cashReason}</p>
        <br>
        <button class="main-btn" id="cashOkBtn">OK</button>
      </div>
    `);

    // Bind OK for cash modal
    setTimeout(() => {
      const cashOk = document.querySelector('#modalMsgContent #cashOkBtn');
      if (cashOk) {
        cashOk.addEventListener('click', () => {
          import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
        }, { once: true });
      }
    }, 50);
  }, 1500); // Delay for turn modal to show first

  // Random disaster (20% chance)
  if (Math.random() < DISASTER_CHANCE) {
    const lossType = getRandomElement(Object.keys(lossReasons)); // e.g., 'crude'
    const reason = lossReasons[lossType];
    let lossAmount = 0;
    let lossMsg = '';

    switch (lossType) {
      case 'crude':
        lossAmount = Math.floor(gameState.crude * DISASTER_AMOUNTS.crude);
        gameState.crude -= lossAmount;
        lossMsg = `<p>${reason} Lost <span class="yellow-value">${lossAmount} bbl</span> crude!</p>`;
        break;
      case 'products':
        // Simplified: Lose 30% of total products (gasoline + diesel + etc.)
        const totalProducts = gameState.gasoline + gameState.diesel + gameState.biogasoline + gameState.biodiesel;
        lossAmount = Math.floor(totalProducts * DISASTER_AMOUNTS.products);
        // Distribute loss evenly or random; here simple deduct from gasoline as proxy
        gameState.gasoline = Math.max(0, gameState.gasoline - lossAmount);
        lossMsg = `<p>${reason} Lost <span class="yellow-value">${lossAmount}</span> product units!</p>`;
        break;
      case 'refineries':
        // Lose 1 random refinery tier if owned
        const tiers = ['small', 'medium', 'large'];
        const tier = getRandomElement(tiers.filter(t => gameState.refineries[t] > 0));
        if (tier) {
          gameState.refineries[tier] -= 1;
          lossAmount = 1;
          lossMsg = `<p>${reason} Lost 1 ${tier} refinery!</p>`;
        } else {
          lossMsg = `<p>${reason} (No refineries affected this time.)</p>`;
        }
        break;
      default:
        console.warn('nextTurn: Unknown loss type.');
        return;
    }

    // Delayed disaster modal (after cash)
    setTimeout(() => {
      showDisasterModal(lossMsg);
    }, 3000);

    console.log(`Disaster: ${lossType} loss of ${lossAmount}`);
  }

  // Reset insurances for next turn
  gameState.insurances = { fire: false, flood: false, labor: false };

  // Uncheck DOM checkboxes
  document.querySelectorAll('.insurance-box').forEach(cb => cb.checked = false);

  // Final UI update
  updateGameUI();

  console.log(`Turn ${gameState.turn} advanced: Crude +${production}, Cash +$${cashAmount.toLocaleString()}.`);
}