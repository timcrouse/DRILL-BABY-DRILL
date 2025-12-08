/* data/state.js */
// Core mutable game state and maps

import { gamePrices } from './prices.js';

export let gameState = {
  turn: 0, // Initialize at Turn 0
  cash: 100000,
  crude: 0,
  refineries: { small:1, medium:0, large:0 },
  gasoline: 0,
  diesel: 0,
  biogasoline: 0,
  biodiesel: 0,
  mode: 'CEO',
  insurances: { fire: false, flood: false, labor: false }
};

export let oilMap = [];
export let wells = {};
export let geoReports = {};
export let selectedCell = { x:1, y:1 };

// Note: gamePrices is imported here for state completeness, but not mutated in this file