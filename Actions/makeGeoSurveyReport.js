/**
 * @fileoverview Actions/makeGeoSurveyReport.js - Geo Survey Report Generator
 * 
 * Purpose: Generates detailed HTML for a geo-survey report at (x,y) based on cell info (hasOil)
 * and mode (affects chance/variance). For dry cells: Negative indicators. For oil: Positive
 * with estimated depths, peak production, success chance (mode-scaled: Engineer 88%, CEO 70%, Gambler 55%).
 * Uses row helper for consistent layout; injects into modals via geoSurvey/showGeoReport.
 * 
 * Key Features:
 * - Binary hasOil check with randomized depths/peak for oil cells.
 * - Mode-based metrics: Higher accuracy/low variance for Engineer.
 * - HTML with CSS classes for Geo-Report.css styling (rows, conclusion, note).
 * 
 * Changes in Refactor:
 * - Added param validation (x,y 1-10; mode string) with fallback.
 * - Randomized minD/maxD/peak with mode variance; used toLocaleString for ft/bbl.
 * - Replaced inline onclick with ID (#closeReportBtn) for post-inject binding (e.g., in Modal.js).
 * - Enhanced JSDoc with @typedef; console log for generated report type.
 * - Minor polish: Consistent spacing, default info {hasOil: false}, extensible row fn.
 * 
 * Dependencies: None (pure HTML gen); styled by Geo-Report.css.
 * 
 * Usage: import { makeGeoSurveyReport } from './makeGeoSurveyReport.js';
 * Example: makeGeoSurveyReport(3, 4, {hasOil: true}, 'CEO'); // Returns HTML with ~70% chance.
 * 
 * @exports {function} makeGeoSurveyReport - Builds report HTML.
 * @param {number} x - Grid column (1-10).
 * @param {number} y - Grid row (1-10).
 * @param {Object} info - Cell data {hasOil: bool, [minDepth, maxDepth, prodPeak]}.
 * @param {string} mode - 'Gambler' | 'CEO' | 'Engineer'.
 * @returns {string} Full HTML string for modal injection.
 * @typedef {Object} CellInfo
 * @property {boolean} hasOil - Oil presence.
 * @property {number} [minDepth] - Min depth ft.
 * @property {number} [maxDepth] - Max depth ft.
 * @property {number} [prodPeak] - Peak bbl/turn.
 */

// Geo survey report generator
const DEFAULT_CHANCE = { Engineer: 88, CEO: 70, Gambler: 55 };
const DEFAULT_VARIANCE = { Engineer: 6, CEO: 12, Gambler: 20 };
const BASE_DEPTH = 3000;
const DEPTH_RANGE = 3000;
const PEAK_BASE = 100;
const PEAK_RANGE = 100;

/**
 * Helper to build a geo-report row.
 * @param {string} label - Label text.
 * @param {string} val - Value text.
 * @returns {string} HTML row div.
 */
function row(label, val) {
  return `<div class="geo-report-row"><span class="geo-report-label">${label}:</span><span class="geo-report-value">${val}</span></div>`;
}

/**
 * Generates the HTML report for a geo survey.
 * @param {number} x - Grid x (1-10).
 * @param {number} y - Grid y (1-10).
 * @param {CellInfo} info - Cell oil info.
 * @param {string} mode - Game mode.
 * @returns {string} Complete report HTML.
 */
export function makeGeoSurveyReport(x, y, info = { hasOil: false }, mode = 'CEO') {
  // Validate params
  if (!Number.isInteger(x) || x < 1 || x > 10 || !Number.isInteger(y) || y < 1 || y > 10) {
    console.warn(`makeGeoSurveyReport: Invalid coords (${x},${y}); using defaults.`);
    x = 1; y = 1;
  }
  if (typeof mode !== 'string' || !DEFAULT_CHANCE[mode]) {
    console.warn(`makeGeoSurveyReport: Invalid mode '${mode}'; defaulting to CEO.`);
    mode = 'CEO';
  }

  let html = `
    <div class="geo-report-container">
      <div class="geo-report-title">GeoSurvey Report - Grid (${x}, ${y})</div>
  `;

  if (!info.hasOil) {
    html += row('Seismic Reflection', 'Weak');
    html += row('Gravity Anomaly', 'None');
    html += row('Hydrocarbon Shows', 'Not detected');
    html += `
      <hr class="geo-report-hr">
      <div class="geo-report-conclusion">Conclusion: No significant petroleum indicators detected.</div>
      <div class="geo-report-note">Note: Subsurface appears non-prospective at depths surveyed.</div>
      <button class="main-btn" id="closeReportBtn">Close</button>
    </div>`;
    console.log(`Generated dry report for (${x},${y}).`);
    return html;
  }

  // Oil case: Randomize depths/peak
  const minDepth = info.minDepth || (BASE_DEPTH + Math.floor(Math.random() * DEPTH_RANGE));
  const maxDepth = info.maxDepth || (minDepth + DEPTH_RANGE + Math.floor(Math.random() * DEPTH_RANGE));
  const prodPeak = info.prodPeak || (PEAK_BASE + Math.floor(Math.random() * PEAK_RANGE));
  const successChance = DEFAULT_CHANCE[mode];
  const prodVariance = DEFAULT_VARIANCE[mode];

  html += row('Seismic Reflection', 'Strong');
  html += row('Gravity Anomaly', 'Positive');
  html += row('Hydrocarbon Shows', 'Present');
  html += row('Estimated Payzone Depth', `${minDepth.toLocaleString()} - ${maxDepth.toLocaleString()} ft`);
  html += row('Peak Production Estimate', `${prodPeak} - ${prodPeak + prodVariance} barrels/turn`);

  html += `
      <hr class="geo-report-hr">
      <div class="geo-report-summary">Chance of Success: ${successChance}%</div>
      <div class="geo-report-summary">Summary: Subsurface structure is promising for commercial oil accumulation.</div>
      <div class="geo-report-note">This report is based on seismic, gravity, and geochemical indicators. (Actual drilling results may vary!)</div>
      <button class="main-btn" id="closeReportBtn">Close</button>
    </div>`;

  console.log(`Generated oil report for (${x},${y}): ${successChance}% chance, peak ${prodPeak} bbl.`);
  return html;
}