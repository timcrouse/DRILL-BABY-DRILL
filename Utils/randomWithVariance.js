/* utils/randomWithVariance.js */
// Pick a random value between min/max ±10% variance

/**
 * Pick a random value between min/max ±10% variance
 */
export function randomWithVariance({min, max}) {
  const base  = min + Math.random() * (max - min);
  const delta = base * (Math.random() * 0.2 - 0.1);
  return +((base + delta).toFixed(2));
}