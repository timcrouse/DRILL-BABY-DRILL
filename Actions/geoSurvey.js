/**
 * @fileoverview Actions/geoSurvey.js - Geo Survey Action
 * 
 * Purpose: Performs a geophysical survey at (x,y): Deducts mode-adjusted cost, generates/stores
 * a detailed HTML report in geoReports via makeGeoSurveyReport, and shows success modal.
 * Validates coords and funds; errors silently or with modal for UX. Updates UI post-survey.
 * Enables informed drilling by revealing cell info (e.g., oil probability, variance by mode).
 * 
 * Key Features:
 * - Cash validation with error modal.
 * - Stores report keyed by 'x,y' for later viewing in well data bar.
 * - Relies on oilMap for base info; mode affects report detail/variance.
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (../Data/index.js, ../UI/index.js, local Actions).
 * - Added coord validation (1-10 integers) and optional chaining for oilMap.
 * - Replaced inline onclick with addEventListener (via helper for success modal).
 * - Enhanced logging/debug; JSDoc with @param/@typedef.
 * - Minor polish: Consistent formatting, future-proof for survey limits.
 * 
 * Dependencies: gameState/getCostsByMode/oilMap/geoReports from Data/index.js; updateGameUI/showModalMessage from UI/index.js; makeGeoSurveyReport from local.
 * 
 * Usage: import { geoSurvey } from './geoSurvey.js'; // Bound to geoSurveyBtn.onclick.
 * Example: geoSurvey(3, 4); // Deducts ~$5000, stores report, shows "Complete" modal.
 * 
 * @exports {function} geoSurvey - Surveys at (x,y) with validation/effects.
 * @param {number} x - Column (1-10).
 * @param {number} y - Row (1-10).
 * @throws {Error} If invalid coords.
 * @typedef {Object} SurveyInfo
 * @property {boolean} hasOil - Base oil presence (from oilMap).
 * @property {string} mode - Current mode for variance.
 */

// Geo survey action
import { gameState, getCostsByMode, oilMap, geoReports } from '../Data/index.js'; // Barrel for data
import { updateGameUI, showModalMessage } from '../UI/index.js'; // Barrel for UI
import { makeGeoSurveyReport } from './makeGeoSurveyReport.js'; // Local import

/**
 * Helper to show success modal with bound OK button.
 */
function showSuccessModal() {
  const successContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Geo Survey Complete</h2>
      <p>Geo survey complete! Click GEO REPORT to view the details.</p>
      <br>
      <button class="main-btn" id="surveyOkBtn">OK</button>
    </div>
  `;

  showModalMessage(successContent);

  // Bind OK post-render
  setTimeout(() => {
    const okBtn = document.querySelector('#modalMsgContent #surveyOkBtn');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
      }, { once: true });
    }
  }, 50);
}

/**
 * Performs geo survey at (x,y): Deducts cost, generates/stores report.
 * @param {number} x - Grid column (1-10).
 * @param {number} y - Grid row (1-10).
 * @throws {Error} If invalid coordinates.
 */
export function geoSurvey(x, y) {
  // Validate coords
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 1 || x > 10 || y < 1 || y > 10) {
    throw new Error(`Invalid coordinates: x=${x}, y=${y} (must be integers 1-10).`);
  }

  const costs = getCostsByMode();
  if (gameState.cash < costs.survey) {
    showModalMessage(`
      <div style="text-align: center; color: #b1d1ee;">
        <h2>Not Enough Cash</h2>
        <p>Not enough cash for a geo survey (need <span class="yellow-value">$${costs.survey.toLocaleString()}</span>).</p>
        <br>
        <button class="main-btn" id="surveyErrorOk">OK</button>
      </div>
    `);

    // Bind OK for error modal
    setTimeout(() => {
      const errorOk = document.querySelector('#modalMsgContent #surveyErrorOk');
      if (errorOk) {
        errorOk.addEventListener('click', () => {
          import('../UI/index.js').then(({ hideModalMessage }) => hideModalMessage());
        }, { once: true });
      }
    }, 50);

    return;
  }

  // Deduct cost
  gameState.cash -= costs.survey;

  // Get cell info (safe access)
  const key = `${x},${y}`;
  const cellInfo = oilMap[y - 1]?.[x - 1] || { hasOil: false };

  // Generate and store report
  geoReports[key] = makeGeoSurveyReport(x, y, cellInfo, gameState.mode);

  // Show success and update UI
  showSuccessModal();
  updateGameUI();

  console.log(`Geo survey at (${x},${y}): Report stored. Cash: $${gameState.cash.toLocaleString()}`);
}