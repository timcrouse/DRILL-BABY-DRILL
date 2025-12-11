/* gameUI.js */
import {
  gameState,
  gamePrices,
  selectedCell
} from './data.js';
import { getCostsByMode } from './data.js';
import { renderGrid } from './grid.js';
import { updateWellDataBar } from './wellDataBar.js';

/**
 * Update **all** status‐panel spans, then re-render.
 */
export function updateGameUI() {
  const s = gameState;

  // Turn & Cash (yellow)
  const turnElement = document.getElementById('turn');
  const cashElement = document.getElementById('cash');
  if (turnElement) turnElement.textContent = s.turn;
  if (cashElement) cashElement.textContent = '$' + s.cash.toLocaleString();

  // Crude qty
  const crudeElement = document.getElementById('crude');
  if (crudeElement) crudeElement.textContent = s.crude;

  // Refinery counts by tier
  const refSmall = document.getElementById('refinery-small');
  const refMedium = document.getElementById('refinery-medium');
  const refLarge = document.getElementById('refinery-large');
  if (refSmall) refSmall.textContent = s.refineries.small;
  if (refMedium) refMedium.textContent = s.refineries.medium;
  if (refLarge) refLarge.textContent = s.refineries.large;

  // Products
  const gasolineElement = document.getElementById('gasoline');
  const dieselElement = document.getElementById('diesel');
  const biogasolineElement = document.getElementById('biogasoline');
  const biodieselElement = document.getElementById('biodiesel');
  if (gasolineElement) gasolineElement.textContent = s.gasoline;
  if (dieselElement) dieselElement.textContent = s.diesel;
  if (biogasolineElement) biogasolineElement.textContent = s.biogasoline;
  if (biodieselElement) biodieselElement.textContent = s.biodiesel;

  // Costs (yellow)
  const costs = getCostsByMode();
  const costDrill = document.getElementById('costDrill');
  const costSurvey = document.getElementById('costSurvey');
  const costWell = document.getElementById('costWell');
  if (costDrill) costDrill.textContent = '$' + costs.drill.toLocaleString();
  if (costSurvey) costSurvey.textContent = '$' + costs.survey.toLocaleString();
  if (costWell) costWell.textContent = '$' + costs.setWell.toLocaleString();

  // Prices (green)
  const priceCrude = document.getElementById('priceCrude');
  const priceGasoline = document.getElementById('priceGasoline');
  const priceDiesel = document.getElementById('priceDiesel');
  const priceEthanol = document.getElementById('priceEthanol');
  const priceBiodiesel = document.getElementById('priceBiodiesel');
  if (priceCrude) priceCrude.textContent = gamePrices.crude.toFixed(2);
  if (priceGasoline) priceGasoline.textContent = gamePrices.gasoline.toFixed(2);
  if (priceDiesel) priceDiesel.textContent = gamePrices.diesel.toFixed(2);
  if (priceEthanol) priceEthanol.textContent = gamePrices.ethanol.toFixed(2);
  if (priceBiodiesel) priceBiodiesel.textContent = gamePrices.biodiesel.toFixed(2);

  // Finally, refresh grid & well data
  renderGrid((x, y) => {
    selectedCell.x = x;
    selectedCell.y = y;
    updateGameUI(); // Re-render on selection change
  });
  updateWellDataBar();

  // Insurance checkboxes
  document.getElementById('chk-ins-fire').checked = gameState.insurances.fire;
  document.getElementById('chk-ins-flood').checked = gameState.insurances.flood;
  document.getElementById('chk-ins-labor').checked = gameState.insurances.labor;
}