/**
 * @fileoverview UI/WellDataBar.js - Well Data Bar Updater
 * 
 * Purpose: Dynamically updates the well data bar (under the grid) with location, depth, production
 * info, and a geo-report button. Handles conditional display: "No Geo-Survey" modal if unsurveyed,
 * or full report if available. Rebuilds HTML on each call to reflect current selectedCell state.
 * 
 * Key Features:
 * - Generates structured HTML rows (.wd-row) for data display.
 * - Toggles button color based on survey existence (gold if available, blue otherwise).
 * - Binds onclick to showGeoReport (from Modal.js) with appropriate content.
 * - Self-contained within UI/ for modularity.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (e.g., '../Data/index.js' for state, './Modal.js' local).
 * - Added null/undefined checks for selectedCell, wells[key], and DOM elements with warnings.
 * - Wrapped in try-catch for resilience; logs updates/errors.
 * - Optimized: Button color/click bound once post-HTML insertion.
 * - Ensured compatibility with renamed modal functions (uses showGeoReport directly).
 * 
 * Dependencies: Data/ for wells/geoReports/selectedCell, Modal.js for showGeoReport.
 * Assumes #well-data-bar in HTML, CSS for .wd-row, .label, button styles.
 * 
 * Usage: Call updateWellDataBar() from updateGameUI or after cell selection.
 * Exported via UI/index.js barrel.
 * 
 * @exports {function} updateWellDataBar - Refreshes the well data bar content and bindings.
 */

// Modular Imports (adjusted for UI/ subdirectory)
import { 
  wells,
  selectedCell,
  geoReports 
} from '../Data/index.js'; // Barrel from parent Data/
import { showGeoReport } from './Modal.js'; // Local in UI/

/**
 * Updates the well data bar with current cell info and geo-report button.
 * Shows modal on button click: full report or "No Geo-Survey" message.
 */
export function updateWellDataBar() {
  try {
    // Guard: Ensure selectedCell is valid
    if (!selectedCell || typeof selectedCell.x !== 'number' || typeof selectedCell.y !== 'number') {
      console.warn('updateWellDataBar: Invalid selectedCell; skipping update.');
      return;
    }

    const key = `${selectedCell.x},${selectedCell.y}`;
    const well = wells[key] || {};

    const wellDataBar = document.getElementById('well-data-bar');
    if (!wellDataBar) {
      console.error('Missing DOM element: #well-data-bar');
      return;
    }

    // Build HTML
    const location = `(${selectedCell.x}, ${selectedCell.y})`;
    const depth = well.depth || 0;
    const production = `${well.currentRate || 0} bbl`;
    const hasSurvey = Boolean(geoReports[key]);

    wellDataBar.innerHTML = `
      <div class="wd-row">
        <span class="label">WELL DATA:</span>
        <span>Location: ${location}</span>
        <span>Depth: ${depth} ft</span>
      </div>
      <div class="wd-row">
        <span>Production: ${production}</span>
        <button id="geoReportBtn">GEO REPORT</button>
      </div>
    `;

    // Bind button post-render
    const geoBtn = document.getElementById('geoReportBtn');
    if (geoBtn) {
      // Color: Gold if surveyed, blue otherwise
      geoBtn.style.color = hasSurvey ? '#f7d860' : '#b1d1ee';

      geoBtn.onclick = () => {
        const reportContent = hasSurvey ? geoReports[key] : `
          <div class="geo-report-title">No Geo-Survey</div>
          <p>You have not purchased a Geo-Survey at ${location}.</p>
        `;
        showGeoReport(reportContent);
      };

      console.log(`Well data bar updated for ${location}: Survey ${hasSurvey ? 'available' : 'not available'}`);
    } else {
      console.warn('Geo report button not found after render');
    }
  } catch (error) {
    console.error('Error updating Well Data Bar:', error);
  }
}