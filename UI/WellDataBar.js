/* wellDataBar.js */
import {
  wells,
  selectedCell,
  geoReports
} from './data.js';
import { showGeoReport } from './modal.js';

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
          showGeoReport(`
            <div class="geo-report-title">No Geo-Survey</div>
            <p>You have not purchased a Geo-Survey at (${selectedCell.x},${selectedCell.y}).</p>
          `);
        } else {
          showGeoReport(geoReports[key]);
        }
      };
    }
  }
}