/**
 * Actions/index.js - Game Action Exports for Drilling, Turns, and Economy
 * 
 * Description: This barrel file aggregates and exports core action functions for the "Drill Baby Drill" game.
 * It provides functions for well actions (drillWell, setWell, geoSurvey), turn advancement (nextTurn),
 * and economy (buyRefinery, sellRefinery, sellProducts, buySelectedItems, confirmDecline). Each function updates gameState, geoReports,
 * wells, etc., and triggers UI updates.
 * 
 * Key Features:
 * - Well actions: Interact with selectedCell, update geoReports/wells, deduct cash.
 * - Turn logic: Advance turn, apply random events (using getRandomCashReason/lossReasons).
 * - Economy: Buy/sell refineries/products with cash validation; buySelectedItems for modal purchases.
 * - Modal handlers: confirmDecline for purchase decline modals (closes modal, resets state).
 * - Integrates with Data (gameState, geoReports) and UI (updateGameUI, showModalMessage).
 * 
 * Usage: Import specifics like { drillWell, nextTurn, buyRefinery, buySelectedItems, confirmDecline } from './Actions/index.js'.
 * 
 * Dependencies: Data/index.js (gameState, selectedCell, geoReports, wells, gamePrices, getCostsByMode, getRandomCashReason, lossReasons).
 * UI/index.js (updateGameUI, showModalMessage).
 * 
 * Changes in This Update (v1.3 - Dec 13, 2025):
 * - Added confirmDecline to fix SyntaxError in main.js.
 * - Retained well actions and economy stubs (expand for full game).
 * - nextTurn with random events for cash changes.
 * 
 * @author Refactored by Grok (xAI)
 * @version 1.3 - Added confirmDecline for Modal Handling
 */

// Core Imports
import { gameState, selectedCell, geoReports, wells, wellData, gamePrices, getCostsByMode, getRandomCashReason, lossReasons } from '../Data/index.js';
import { updateGameUI, showModalMessage } from '../UI/index.js';


export {confirmPurchase} from 'confirmPurchase.js'
/**
 * Drill a well at selected coordinates (deducts cash, simulates depth).
 * @param {number} x - Grid X coord.
 * @param {number} y - Grid Y coord.
 */
export function drillWell(x, y) {
  if (selectedCell.x !== x || selectedCell.y !== y) {
    selectedCell.x = x;
    selectedCell.y = y;
  }
  const costs = getCostsByMode(gameState.mode);
  if (gameState.cash < costs.drill) {
    showModalMessage('Insufficient cash for drilling!');
    return;
  }
  gameState.cash -= costs.drill;
  // Simulate drill: Update geoReports if surveyed
  const key = `${x}_${y}`;
  if (geoReports[key]) {
    geoReports[key].drilled = true;
    showModalMessage(`Drilled at (${x}, ${y}) - Potential: ${Math.round(geoReports[key].potential * 100)}%`);
  } else {
    showModalMessage('Survey first for better results!');
  }
  updateGameUI();
}

/**
 * Set a well at selected coordinates (installs well if drilled).
 * @param {number} x - Grid X coord.
 * @param {number} y - Grid Y coord.
 */
export function setWell(x, y) {
  if (selectedCell.x !== x || selectedCell.y !== y) {
    selectedCell.x = x;
    selectedCell.y = y;
  }
  const costs = getCostsByMode(gameState.mode);
  if (gameState.cash < costs.well) {
    showModalMessage('Insufficient cash for well installation!');
    return;
  }
  const key = `${x}_${y}`;
  if (!geoReports[key] || !geoReports[key].drilled) {
    showModalMessage('Drill first!');
    return;
  }
  gameState.cash -= costs.well;
  wells[key] = {
    production: Math.floor(geoReports[key].potential * 1000), // e.g., 0.7 potential → 700 bbl/day
    active: true
  };
  wellData.push({ x, y, production: wells[key].production });
  gameState.resources.crude += wells[key].production; // Initial yield
  showModalMessage(`Well set at (${x}, ${y}) - Producing ${wells[key].production} bbl/day!`);
  updateGameUI();
}

/**
 * Conduct geo survey at selected coordinates (reveals oil potential).
 * @param {number} x - Grid X coord.
 * @param {number} y - Grid Y coord.
 */
export function geoSurvey(x, y) {
  if (selectedCell.x !== x || selectedCell.y !== y) {
    selectedCell.x = x;
    selectedCell.y = y;
  }
  const costs = getCostsByMode(gameState.mode);
  if (gameState.cash < costs.survey) {
    showModalMessage('Insufficient cash for survey!');
    return;
  }
  gameState.cash -= costs.survey;
  const key = `${x}_${y}`;
  geoReports[key] = {
    potential: Math.random(), // 0-1 oil potential
    surveyed: true,
    turn: gameState.turn
  };
  surveyResults.push({ x, y, potential: geoReports[key].potential, turn: gameState.turn });
  showModalMessage(`Surveyed (${x}, ${y}) - Potential: ${Math.round(geoReports[key].potential * 100)}%`);
  updateGameUI();
}

/**
 * Advance to next turn (produces resources, applies random events).
 */
export function nextTurn() {
  // Produce crude from wells
  let totalProduction = 0;
  Object.values(wells).forEach(well => {
    if (well.active) totalProduction += well.production;
  });
  gameState.resources.crude += totalProduction;
  
  // Random cash event
  const reason = getRandomCashReason();
  const [desc, change] = reason.split(': ');
  const amount = parseInt(change) || 0;
  gameState.cash += amount;
  showModalMessage(`Turn ${gameState.turn}: ${desc} (Cash change: $${amount})`);
  
  // Potential loss event
  if (Math.random() < 0.3) { // 30% chance
    const loss = lossReasons[Math.floor(Math.random() * lossReasons.length)];
    const [lossDesc, lossChange] = loss.split(': ');
    const lossAmount = parseInt(lossChange) || 0;
    gameState.cash += lossAmount; // Negative
    showModalMessage(lossDesc);
  }
  
  // Update prices (stub; integrate real prices.js)
  // gamePrices.crude = ...;
  
  updateGameUI();
}

/**
 * Buy a refinery (small by default; deducts cash, updates count).
 * @param {string} size - 'small', 'medium', 'large'.
 */
export function buyRefinery(size = 'small') {
  const costs = { small: 10000, medium: 25000, large: 50000 };
  const cost = costs[size];
  if (gameState.cash < cost) {
    showModalMessage('Insufficient cash for refinery!');
    return;
  }
  gameState.cash -= cost;
  gameState.resources.refinery[size]++;
  showModalMessage(`Bought ${size} refinery! Total: ${gameState.resources.refinery[size]}`);
  updateGameUI();
}

/**
 * Sell a refinery (small by default; adds cash, decrements count).
 * @param {string} size - 'small', 'medium', 'large'.
 */
export function sellRefinery(size = 'small') {
  if (gameState.resources.refinery[size] <= 0) {
    showModalMessage('No refineries to sell!');
    return;
  }
  const sellPrices = { small: 8000, medium: 20000, large: 40000 };
  const sellPrice = sellPrices[size];
  gameState.cash += sellPrice;
  gameState.resources.refinery[size]--;
  showModalMessage(`Sold ${size} refinery for $${sellPrice}!`);
  updateGameUI();
}

/**
 * Sell products (all types; calculates value based on prices).
 * @returns {number} Total cash from sale.
 */
export function sellProducts() {
  let totalValue = 0;
  const productKeys = ['gasoline', 'diesel', 'biogasoline', 'biodiesel'];
  productKeys.forEach(key => {
    const qty = gameState.products[key];
    if (qty > 0) {
      // Assume conversion: 1 crude → 1 product; price from gamePrices
      const price = gamePrices[key] || 100; // Fallback
      totalValue += qty * price;
      gameState.products[key] = 0;
    }
  });
  if (totalValue > 0) {
    gameState.cash += totalValue;
  }
  return totalValue;
}

/**
 * Buy selected items from modal (e.g., refineries, insurances; generic handler).
 * @param {Array} items - Array of { type, size, qty, cost }.
 */
export function buySelectedItems(items = []) {
  let totalCost = 0;
  items.forEach(item => {
    totalCost += item.cost * item.qty;
    // Update state based on type
    if (item.type === 'refinery') {
      for (let i = 0; i < item.qty; i++) {
        buyRefinery(item.size);
      }
    } else if (item.type === 'insurance') {
      // Example: Toggle insurance in gameState.insurances[item.name] = true;
      gameState.insurances[item.name] = true;
      showModalMessage(`Purchased ${item.name} insurance!`);
    }
    // Add more types as needed (e.g., mods)
  });
  if (gameState.cash < totalCost) {
    showModalMessage('Insufficient cash for selected items!');
    return;
  }
  gameState.cash -= totalCost;
  showModalMessage(`Purchased items for $${totalCost}!`);
  updateGameUI();
}

/**
 * Confirm decline of a purchase or action (closes decline modal, resets pending state).
 * @param {string} modalType - Type of modal (e.g., 'purchase', 'sell').
 */
export function confirmDecline(modalType = 'purchase') {
  // Close the modal (assumes global or UI handler)
  if (typeof window.hideDeclineConfirm === 'function') {
    window.hideDeclineConfirm();
  }
  // Reset pending state if needed (e.g., clear cart)
  if (modalType === 'purchase') {
    // Example: Clear selected items array
    console.log('Purchase declined - cart cleared.');
  }
  showModalMessage('Action declined. No changes made.');
  updateGameUI();
}