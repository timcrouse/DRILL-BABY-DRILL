/* utils/getRandomElement.js */
// Select a random element from an array

export function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}