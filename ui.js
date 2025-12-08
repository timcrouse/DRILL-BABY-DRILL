/* ui.js */
import {
  GRID_SIZE,
  wells,
  oilMap,
  geoReports,
  selectedCell,
  gameState,
  gamePrices
} from './data.js';
import { getCostsByMode } from './data.js';

// Make hideModalMessage global for onclick in report HTML
export function showModalMessage(msg) {
  console.log('showModalMessage called with msg length:', msg.length);
  const modal = document.getElementById('modalMessage');
  const content = document.getElementById('modalMsgContent');
  if (modal && content) {
    content.innerHTML = msg;
    modal.style.display = 'flex';
  } else {
    console.error('Modal elements not found');
  }
}
export function hideModalMessage() {
  console.log('hideModalMessage called');
  const modal = document.getElementById('modalMessage');
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error('Modal element not found');
  }
}
window.hideModalMessage = hideModalMessage; // Expose to global scope

/**
 * Render the 10×10 grid:
 * - Yellow headers (Luckiest Guy via .yellow-value in CSS)
 * - Only border highlight on selection
 * - X or well icon + geo-dot
 */
export function renderGrid() {
  let html = '<tr><th></th>';
  for (let x = 1; x <= GRID_SIZE; x++) {
    html += `<th class="yellow-value">${x}</th>`;
  }
  html += '</tr>';

  const wellSvg = document.getElementById('setWellBtn')?.innerHTML || '';

  for (let y = 1; y <= GRID_SIZE; y++) {
    html += `<tr><th class="yellow-value">${y}</th>`;
    for (let x = 1; x <= GRID_SIZE; x++) {
      const key       = `${x},${y}`;
      const cell      = wells[key] || {};
      const info      = oilMap[y-1]?.[x-1] || {};
      const drilled   = !!cell.drilled;
      const wellSet   = !!cell.well;
      const producing = !!cell.producing;
      const struck    = drilled && info.hasOil && cell.depth >= 2000 && cell.currentRate > 0;
      const hasGeo    = Boolean(geoReports[key]);
      const geoDot    = hasGeo ? '<span class="geo-dot"></span>' : '';

      let mark = '';
      if (wellSet) {
        mark = producing
          ? `<span class="well-icon">${wellSvg}</span>`
          : `<span class="well-icon" style="filter:saturate(0) brightness(0.7)">${wellSvg}</span>`;
      } else if (drilled) {
        mark = `<span class="cell-x ${struck ? 'x-struck' : 'x-dry'}">X</span>`;
      }
      mark += geoDot;

      const isSel = (selectedCell.x === x && selectedCell.y === y);
      const cls   = isSel ? 'selected' : '';

      html += `<td data-x="${x}" data-y="${y}" class="${cls}">${mark}</td>`;
    }
    html += '</tr>';
  }

  const grid = document.getElementById('xy-grid');
  if (grid) {
    grid.innerHTML = html;
    document.querySelectorAll('#xy-grid td').forEach(td => {
      td.onclick = () => {
        selectedCell.x = +td.dataset.x;
        selectedCell.y = +td.dataset.y;
        updateGameUI();
      };
    });
  }
}

/**
 * Update the Well Data Bar under the grid.
 * • If no survey bought: show “No Geo-Survey” message
 * • If survey exists: show the full report HTML
 */
export function updateWellDataBar() {
  const key = `${selectedCell.x},${selectedCell.y}`;
  const w   = wells[key] || {};

  const wellDataBar = document.getElementById('well-data-bar');
  if (wellDataBar) {
    wellDataBar.innerHTML = `
      <div class="wd-row">
        <span class="label">WELL DATA:</span>
        <span>Location: (${selectedCell.x}, ${selectedCell.y})</span>
        <span>Depth: ${w.depth || 0} ft</span>
      </div>
      <div class="wd-row">
        <span>Production: ${w.currentRate || 0} bbl</span>
        <button id="geoReportBtn">GEO REPORT</button>
      </div>
    `;

    const geoBtn = document.getElementById('geoReportBtn');
    if (geoBtn) {
      geoBtn.style.color = geoReports[key] ? '#f7d860' : '#b1d1ee';
      geoBtn.onclick = () => {
        if (!geoReports[key]) {
          showModalMessage(`
            <div class="geo-report-container">
              <div class="geo-report-title">No Geo-Survey</div>
              <p>You have not purchased a Geo-Survey at (${selectedCell.x},${selectedCell.y}).</p>
              <br>
              <button class="main-btn" onclick="window.hideModalMessage()">Close</button>
            </div>
          `);
        } else {
          showModalMessage(geoReports[key]);
        }
      };
    }
  }
}

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
  renderGrid();
  updateWellDataBar();

  document.getElementById('chk-ins-fire').checked   = gameState.insurances.fire;
  document.getElementById('chk-ins-flood').checked  = gameState.insurances.flood;
  document.getElementById('chk-ins-labor').checked  = gameState.insurances.labor;

}