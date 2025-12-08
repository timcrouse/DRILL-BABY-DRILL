/* data/costs.js */
// Mode-specific cost calculations

import { gameState } from './state.js';

export function getCostsByMode() {
  const m = gameState.mode;
  return {
    drill:   m==='Gambler'?1000: m==='Engineer'?3000:1500,
    setWell: m==='Gambler'?15000:m==='Engineer'?25000:20000,
    survey:  m==='Gambler'?3000: m==='Engineer'?7000: 5000
  };
}