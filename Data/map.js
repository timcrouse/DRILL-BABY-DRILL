/* data/map.js */
// Oil map generation and management

import { GRID_SIZE } from './constants.js';
import { oilMap, wells, geoReports } from './state.js';

export function generateOilMap() {
  oilMap = Array.from({length:GRID_SIZE}, () =>
    Array.from({length:GRID_SIZE}, () => ({ hasOil: Math.random()<0.5 }))
  );
  wells = {};
  geoReports = {};
}