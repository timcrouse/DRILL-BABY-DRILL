import { gameState, getCostsByMode, wells } from './data.js';
import { updateGameUI } from './ui.js';

/** Set Well action */
export function setWell(x,y) {
  const costs = getCostsByMode();
  const key   = `${x},${y}`;
  if (!wells[key]?.drilled || gameState.cash < costs.setWell) return;
  gameState.cash -= costs.setWell;
  wells[key].well = true;
  updateGameUI();
}