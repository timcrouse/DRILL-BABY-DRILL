/* utils.js */
// General helpers

/**
 * Pick a random value between min/max ±10% variance
 */
export function randomWithVariance({min, max}) {
  const base  = min + Math.random() * (max - min);
  const delta = base * (Math.random() * 0.2 - 0.1);
  return +((base + delta).toFixed(2));
}

export function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}