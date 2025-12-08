import { gameState, getCostsByMode, oilMap, geoReports } from './data.js';
import { updateGameUI, showModalMessage } from './ui.js';
import { makeGeoSurveyReport } from './makeGeoSurveyReport.js';

/** Geo Survey action – now generates full report */
export function geoSurvey(x,y) {
  const costs = getCostsByMode();
  if (gameState.cash < costs.survey) {
    showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
      <h2>Not Enough Cash</h2>
      <p>Not enough cash for a geo survey.</p>
      <br>
      <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
    </div>`);
    return;
  }
  gameState.cash -= costs.survey;

  const key  = `${x},${y}`;
  const info = oilMap[y-1][x-1] || {};
  // store the rich HTML report
  geoReports[key] = makeGeoSurveyReport(x, y, info, gameState.mode);

  showModalMessage(`<div style="text-align: center; color: #b1d1ee;">
    <h2>Geo Survey Complete</h2>
    <p>Geo survey complete! Click GEO REPORT to view the details.</p>
    <br>
    <button class="main-btn" onclick="window.hideModalMessage()">OK</button>
  </div>`);
  updateGameUI();
}