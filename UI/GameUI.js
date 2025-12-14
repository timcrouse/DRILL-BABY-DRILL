/**
 * @fileoverview UI/GameUI.js - Game UI Updater
 * 
 * Purpose: Handles comprehensive updates to the game's status panel, including turn/cash, resources,
 * refinery counts, products, costs, prices, insurance checkboxes, and triggers grid/well data refreshes.
 * This centralizes all UI state synchronization to keep the display in sync with gameState.
 * 
 * Key Features:
 * - Updates multiple DOM elements with formatted values (e.g., currency localization).
 * - Fetches mode-based costs dynamically.
 * - Integrates grid rendering with cell selection (avoids recursion by separating concerns).
 * - Checks/refreshes insurance toggles.
 * 
 * Changes in Refactor:
 * - Updated imports to use modular subdir barrels (e.g., '../Data/index.js' instead of './data.js').
 * - Removed duplicate import for getCostsByMode.
 * - Fixed potential infinite recursion: Moved selection update outside renderGrid callback.
 *   Now, renderGrid is called without a re-render loop; assume external handlers (e.g., in events.js)
 *   call updateGameUI() on actual selection changes.
 * - Added null checks and console warnings for missing DOM elements.
 * - Improved error resilience and logging for debugging.
 * 
 * Dependencies: Relies on Data/ for state/prices, local UI files for grid/well bar.
 * 
 * Usage: Call updateGameUI() from bootstrap, actions, or events (e.g., after state changes).
 * Exported via UI/index.js barrel.
 * 
 * @exports {function} updateGameUI - Main function to refresh all game UI elements.
 */

// Modular Imports (adjusted for UI/ subdirectory)
import { 
  gameState, 
  gamePrices, 
  selectedCell, 
  getCostsByMode 
} from '../Data/index.js'; // Barrel from parent Data/
import { renderGrid } from './Grid.js'; // Local in UI/
import { updateWellDataBar } from './WellDataBar.js'; // Local in UI/

/**
 * Update all status-panel spans, resources, costs/prices, then refresh grid & well data.
 * Ensures UI reflects current gameState without recursion.
 */
export function updateGameUI() {
  const s = gameState;

  try {
    // Turn & Cash (yellow)
    const turnElement = document.getElementById('turn');
    const cashElement = document.getElementById('cash');
    if (turnElement) turnElement.textContent = s.turn;
    else console.warn('Missing DOM: #turn');
    if (cashElement) cashElement.textContent = '$' + s.cash.toLocaleString();
    else console.warn('Missing DOM: #cash');

    // Crude qty
    const crudeElement = document.getElementById('crude');
    if (crudeElement) crudeElement.textContent = s.crude;
    else console.warn('Missing DOM: #crude');

    // Refinery counts by tier
    const refSmall = document.getElementById('refinery-small');
    const refMedium = document.getElementById('refinery-medium');
    const refLarge = document.getElementById('refinery-large');
    if (refSmall) refSmall.textContent = s.refineries.small;
    else console.warn('Missing DOM: #refinery-small');
    if (refMedium) refMedium.textContent = s.refineries.medium;
    else console.warn('Missing DOM: #refinery-medium');
    if (refLarge) refLarge.textContent = s.refineries.large;
    else console.warn('Missing DOM: #refinery-large');

    // Products
    const gasolineElement = document.getElementById('gasoline');
    const dieselElement = document.getElementById('diesel');
    const biogasolineElement = document.getElementById('biogasoline');
    const biodieselElement = document.getElementById('biodiesel');
    if (gasolineElement) gasolineElement.textContent = s.gasoline;
    else console.warn('Missing DOM: #gasoline');
    if (dieselElement) dieselElement.textContent = s.diesel;
    else console.warn('Missing DOM: #diesel');
    if (biogasolineElement) biogasolineElement.textContent = s.biogasoline;
    else console.warn('Missing DOM: #biogasoline');
    if (biodieselElement) biodieselElement.textContent = s.biodiesel;
    else console.warn('Missing DOM: #biodiesel');

    // Costs (yellow) - Mode-based
    const costs = getCostsByMode();
    const costDrill = document.getElementById('costDrill');
    const costSurvey = document.getElementById('costSurvey');
    const costWell = document.getElementById('costWell');
    if (costDrill) costDrill.textContent = '$' + costs.drill.toLocaleString();
    else console.warn('Missing DOM: #costDrill');
    if (costSurvey) costSurvey.textContent = '$' + costs.survey.toLocaleString();
    else console.warn('Missing DOM: #costSurvey');
    if (costWell) costWell.textContent = '$' + costs.setWell.toLocaleString();
    else console.warn('Missing DOM: #costWell');

    // Prices (green)
    const priceCrude = document.getElementById('priceCrude');
    const priceGasoline = document.getElementById('priceGasoline');
    const priceDiesel = document.getElementById('priceDiesel');
    const priceEthanol = document.getElementById('priceEthanol');
    const priceBiodiesel = document.getElementById('priceBiodiesel');
    if (priceCrude) priceCrude.textContent = gamePrices.crude.toFixed(2);
    else console.warn('Missing DOM: #priceCrude');
    if (priceGasoline) priceGasoline.textContent = gamePrices.gasoline.toFixed(2);
    else console.warn('Missing DOM: #priceGasoline');
    if (priceDiesel) priceDiesel.textContent = gamePrices.diesel.toFixed(2);
    else console.warn('Missing DOM: #priceDiesel');
    if (priceEthanol) priceEthanol.textContent = gamePrices.ethanol.toFixed(2);
    else console.warn('Missing DOM: #priceEthanol');
    if (priceBiodiesel) priceBiodiesel.textContent = gamePrices.biodiesel.toFixed(2);
    else console.warn('Missing DOM: #priceBiodiesel');

    // Refresh grid (no callback recursion - handle selection externally)
    renderGrid(); // Renders with current selectedCell; external clicks update selection & call this again

    // Update well data bar
    updateWellDataBar();

    // Insurance checkboxes (sync with state)
    const fireChk = document.getElementById('chk-ins-fire');
    const floodChk = document.getElementById('chk-ins-flood');
    const laborChk = document.getElementById('chk-ins-labor');
    if (fireChk) fireChk.checked = s.insurances.fire;
    else console.warn('Missing DOM: #chk-ins-fire');
    if (floodChk) floodChk.checked = s.insurances.flood;
    else console.warn('Missing DOM: #chk-ins-flood');
    if (laborChk) laborChk.checked = s.insurances.labor;
    else console.warn('Missing DOM: #chk-ins-labor');

    console.log('Game UI updated successfully');
  } catch (error) {
    console.error('Error updating Game UI:', error);
    // Optionally show a modal, but keep it non-blocking
  }
}