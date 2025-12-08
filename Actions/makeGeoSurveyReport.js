/**
 * Build the detailed Geo-Survey report HTML (V22 style)
 */
export function makeGeoSurveyReport(x, y, info, mode) {
  const row = (label, val) =>
    `<div class="geo-report-row"><span class="geo-report-label">${label}</span> <span class="geo-report-value">${val}</span></div>`;

  let html = `
    <div class="geo-report-container">
      <div class="geo-report-title">GeoSurvey Report - Grid (${x}, ${y})</div>
  `;

  if (!info.hasOil) {
    html += row("Seismic Reflection:", "Weak");
    html += row("Gravity Anomaly:",    "None");
    html += row("Hydrocarbon Shows:",  "Not detected");
    html += `
      <hr class="geo-report-hr">
      <div class="geo-report-conclusion">Conclusion: No significant petroleum indicators detected.</div>
      <div class="geo-report-note">Note: Subsurface appears non-prospective at depths surveyed.</div>
      <button class="main-btn" onclick="window.hideModalMessage()">Close</button>
    </div>`;
    return html;
  }

  // Oil-present case
  const minD     = info.minDepth  || 3000 + Math.floor(Math.random()*4000);
  const maxD     = info.maxDepth  || minD + 3000 + Math.floor(Math.random()*3000);
  const peak     = info.prodPeak  || 100 + Math.floor(Math.random()*100);
  const chance   = mode==='Engineer'?88:mode==='CEO'?70:55;
  const variance = mode==='Engineer'?6:mode==='CEO'?12:20;

  html += row("Seismic Reflection:",   "Strong");
  html += row("Gravity Anomaly:",      "Positive");
  html += row("Hydrocarbon Shows:",    "Present");
  html += row("Estimated Payzone Depth:", `${minD.toLocaleString()} - ${maxD.toLocaleString()} ft`);
  html += row("Peak Production Estimate:", `${peak} - ${peak+variance} barrels/turn`);

  html += `
      <hr class="geo-report-hr">
      <div class="geo-report-summary">Chance of Success: ${chance}%</div>
      <div class="geo-report-summary">Summary: Subsurface structure is promising for commercial oil accumulation.</div>
      <div class="geo-report-note">This report is based on seismic, gravity, and geochemical indicators. (Actual drilling results may vary!)</div>
      <button class="main-btn" onclick="window.hideModalMessage()">Close</button>
    </div>`;
  return html;
}