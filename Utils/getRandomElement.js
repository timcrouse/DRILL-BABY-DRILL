/**
 * @fileoverview Utils/getRandomElement.js - Random Array Selector
 * 
 * Purpose: Provides a simple utility to select a random element from an array.
 * Useful for game mechanics like random events, oil strikes, or price fluctuations.
 * Handles edge cases like empty arrays gracefully.
 * 
 * Key Features:
 * - Uses Math.random() for uniform selection.
 * - Returns undefined for empty arrays (non-throwing).
 * - No dependencies; pure function.
 * 
 * Changes in Refactor:
 * - Added JSDoc for documentation.
 * - Input validation: Warns on non-array input, returns null for empty.
 * - Optional logging for debugging (disabled by default).
 * 
 * Dependencies: None.
 * 
 * Usage: Import via Utils/index.js barrel: import { getRandomElement } from '../Utils/index.js';
 * Example: const randItem = getRandomElement(['oil', 'dry', 'gas']);
 * 
 * @exports {function} getRandomElement - Selects and returns a random array element.
 */

// Utility function to pick random element
export function getRandomElement(arr) {
  // Validate input
  if (!Array.isArray(arr)) {
    console.warn('getRandomElement: Input must be an array; received:', typeof arr);
    return null;
  }

  if (arr.length === 0) {
    console.warn('getRandomElement: Empty array provided; returning null');
    return null;
  }

  const index = Math.floor(Math.random() * arr.length);
  const element = arr[index];
  
  // Optional debug log (remove in production)
  // console.log(`Random element selected: ${element} (index ${index})`);
  
  return element;
}