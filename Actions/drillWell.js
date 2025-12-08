import { gameState, getCostsByMode, wells, oilMap } from './data.js';
import { updateGameUI } from './ui.js';

/** Drill action */
export function drillWell(x,y) {
  const costs = getCostsByMode();
  if (gameState.cash < costs.drill) return;
  gameState.cash -= costs.drill;

  const key = `${x},${y}`;
  if (!wells[key]) wells[key] = { drilled:false, depth:0, well:false, producing:false, currentRate:0 };
  wells[key].drilled = true;
  wells[key].depth  += 1000;

  const info = oilMap[y-1][x-1];
  if (info.hasOil && wells[key].depth >= 2000) {
    wells[key].producing  = true;
    wells[key].currentRate = Math.floor(wells[key].depth/100);
  }

  updateGameUI();
}