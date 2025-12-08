/* data/prices.js */
// Price initialization and management

import { randomWithVariance } from '../utils/randomWithVariance.js';
import { PRICE_RANGES } from './constants.js';

export function initPrices() {
  const p = {
    crude:    randomWithVariance(PRICE_RANGES.crude),
    gasoline: randomWithVariance(PRICE_RANGES.gasoline),
    diesel:   randomWithVariance(PRICE_RANGES.diesel)
  };
  p.ethanol   = +(p.gasoline * 0.85).toFixed(2);
  p.biodiesel = +(p.diesel   * 0.75).toFixed(2);
  return p;
}

export const gamePrices = initPrices();