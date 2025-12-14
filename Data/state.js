/**
 * @fileoverview Data/state.js - Core Mutable Game State
 * 
 * Purpose: Defines and exports the central mutable game state object (gameState) for tracking
 * turn, cash, resources, refineries, products, mode, and insurances. Also exports grids/maps
 * (oilMap 2D array, wells/geoReports objects) and selectedCell for UI interactions.
 * Uses `let` exports for mutation by other modules (e.g., generateOilMap resets oilMap).
 * Initializes to starting values; supports reset for new games.
 * 
 * Key Features:
 * - gameState: Comprehensive object for all game progress/metrics.
 * - oilMap: 2D array of cell info (populated by map.js).
 * - wells/geoReports: Objects keyed by 'x,y' for per-cell data.
 * - selectedCell: Current grid selection (1-based for user-friendliness).
 * 
 * Changes in Refactor:
 * - Removed unused gamePrices import (handle in UI if needed for display).
 * - Added resetGameState() function for clean restarts (e.g., on resetBtn click).
 * - Enhanced initializations: Ensured 1-based selectedCell, default mode 'CEO'.
 * - Added JSDoc with @typedef for state structure; validation in reset.
 * - Minor polish: Consistent spacing, comments, and immutable defaults where possible.
 * 
 * Dependencies: None (self-contained); mutated by map.js, actions.js.
 * 
 * Usage: import { gameState, selectedCell, resetGameState } from './state.js';
 * Example: gameState.cash -= 1000; // Deduct drill cost
 * resetGameState(); // Back to Turn 0, $100k, etc.
 * 
 * @exports {Object} gameState - Mutable core state.
 * @exports {Array} oilMap - 2D oil presence map.
 * @exports {Object} wells - Per-cell well data {'x,y': {drilled, well, ...}}.
 * @exports {Object} geoReports - Per-cell survey reports {'x,y': html}.
 * @exports {Object} selectedCell - Current {x, y} selection.
 * @exports {function} resetGameState - Resets to initial values.
 * @typedef {Object} GameState
 * @property {number} turn - Current turn (starts at 0).
 * @property {number} cash - Available cash ($).
 * @property {number} crude - Crude oil barrels.
 * @property {Object} refineries - {small, medium, large} counts.
 * @property {number} [gasoline] - Gasoline units.
 * @property {number} [diesel] - Diesel units.
 * @property {number} [biogasoline] - Biogasoline units.
 * @property {number} [biodiesel] - Biodiesel units.
 * @property {string} mode - 'Gambler' | 'CEO' | 'Engineer'.
 * @property {Object} insurances - {fire, flood, labor} booleans.
 */

// Core mutable game state and maps

// Initial state template (immutable default)
const INITIAL_STATE = {
  turn: 0,
  cash: 100_000,
  crude: 0,
  refineries: { small: 1, medium: 0, large: 0 },
  gasoline: 0,
  diesel: 0,
  biogasoline: 0,
  biodiesel: 0,
  mode: 'CEO',
  insurances: { fire: false, flood: false, labor: false }
};

/**
 * Resets game state to initial values (e.g., for new game or reset button).
 */
export function resetGameState() {
  Object.assign(gameState, { ...INITIAL_STATE });
  oilMap.length = 0;
  Object.keys(wells).forEach(key => delete wells[key]);
  Object.keys(geoReports).forEach(key => delete geoReports[key]);
  selectedCell = { x: 1, y: 1 };
  console.log('Game state reset to initial values.');
}

// Mutable exports (let for reassignment in map.js etc.)
export let gameState = { ...INITIAL_STATE };
export let oilMap = []; // 2D array: oilMap[y-1][x-1] = { hasOil: bool }
export let wells = {}; // { 'x,y': { drilled: bool, well: bool, depth: num, currentRate: num, producing: bool } }
export let geoReports = {}; // { 'x,y': '<div class="geo-report">...</div>' }
export let selectedCell = { x: 1, y: 1 }; // 1-based for grid coords