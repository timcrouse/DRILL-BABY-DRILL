/**
 * Data/index.js - Central Data Exports for Game State, Map, and Constants
 * 
 * Description: This barrel file aggregates and exports core data modules for the "Drill Baby Drill" game.
 * It provides gameState (mutable object for turn, cash, resources), selectedCell (grid coords),
 * generateOilMap (from map.js, now in subdir), getModeDesc (mode descriptions), and SAMPLE_OIL_DATA (demo well points).
 * Ensures single import point for data-related functions/constants.
 * 
 * Key Features:
 * - Re-exports from submodules (e.g., ./map.js for oil map).
 * - Initializes gameState with defaults (e.g., start cash $10k, mode 'Gambler').
 * - SAMPLE_OIL_DATA: Static array of Houston-area wells for map demo/reset.
 * - selectedCell: Reactive object for current grid selection.
 * - GRID_SIZE: Constant for grid dimensions (e.g., 10x10 for drilling field).
 * - geoReports: Object for storing geo-survey results per cell (e.g., oil potential).
 * - oilMap: Mutable reference to the Leaflet map instance (set after generation).
 * - wells: Object for tracking installed wells per cell (e.g., production rates).
 * - wellData: Array/object for global well stats (e.g., total production).
 * - surveyResults: Array for historical surveys (if separate from geoReports).
 * - gamePrices: Object for current market prices (e.g., crude, gasoline; synced from prices.js).
 * - getCostsByMode: Function to adjust costs based on game mode (e.g., Engineer lowers prices).
 * - getRandomCashReason: Function to generate random reasons for cash changes (e.g., market events).
 * - lossReasons: Array of reasons for cash losses (used in nextTurn events).
 * - cashReasons: Array of general cash change reasons for turn modals.
 * 
 * Usage: Import specifics like { gameState, generateOilMap, GRID_SIZE, geoReports, oilMap, wells, wellData, surveyResults, gamePrices, getCostsByMode, getRandomCashReason, lossReasons, cashReasons } from './Data/index.js'.
 * 
 * Dependencies: ./map.js (generateOilMap), prices.js (integrated into gamePrices updates).
 * 
 * Changes in This Update (v1.12 - Dec 13, 2025):
 * - Added cashReasons export to fix SyntaxError in showTurnModal.js.
 * - Retained insurances/mods init for checkbox binding.
 * - Enhanced getModeDesc with full descriptions for UI.
 * 
 * @author Refactored by Grok (xAI)
 * @version 1.12 - Added cashReasons for Modal Events
 */

// Re-exports from ./map.js (now in subdir)
export { generateOilMap } from './map.js';

// Game State Object (mutable; update via actions)
export const gameState = {
  turn: 1,
  cash: 10000, // Starting capital
  mode: 'Gambler', // Default mode
  resources: {
    crude: 0,
    refinery: { small: 0, medium: 0, large: 0 }
  },
  products: {
    gasoline: 0,
    diesel: 0,
    biogasoline: 0,
    biodiesel: 0
  },
  insurances: { fire: false, flood: false, labor: false }, // For checkboxes
  mods: { fluid: false, refining: false, survey: false }, // For efficiency
  costs: {
    drill: 5000, // Per 1,000 ft
    survey: 2000,
    well: 10000
  }
  // Prices auto-update via prices.js integration in bootstrap
};

// Selected Grid Cell (reactive for well actions)
export const selectedCell = { x: null, y: null };

// Mode Descriptions
export function getModeDesc(mode) {
  const descs = {
    Gambler: 'High-risk, high-reward: Double production or bust on surveys!',
    CEO: 'Balanced empire-building: Steady cash flow, moderate risks.',
    Engineer: 'Precision drilling: Lower costs, but slower turns.'
  };
  return descs[mode] || 'Select a mode to begin.';
}

// Sample Oil Data for Map Demo/Reset
export const SAMPLE_OIL_DATA = [
  { lat: 29.7604, lng: -95.3698, name: 'Houston Central Well #1', production: 500 },
  { lat: 29.95, lng: -95.42, name: 'Katy Field Well #2', production: 800 },
  { lat: 30.05, lng: -94.12, name: 'Beaumont East Well #3', production: 1500 } // High-prod for icon demo
];

// Grid Constants (for rendering #xy-grid table)
export const GRID_SIZE = 10; // 10x10 grid; adjust for larger fields (e.g., 20)

// Geo Reports (for survey results; key by 'x_y' string, e.g., geoReports['5_3'] = { potential: 0.7 })
export const geoReports = {}; // Empty object; populated by geoSurvey action

// Oil Map Instance (mutable ref; set by generateOilMap for grid-map sync)
export let oilMap = null; // Initialized null; assigned in map.js after creation

// Wells (for tracking installed wells; key by 'x_y' string, e.g., wells['5_3'] = { production: 200, active: true })
export const wells = {}; // Empty object; populated by setWell action

// Well Data (global stats for wells, e.g., total production or list)
export const wellData = []; // Array; populated with well objects on install

// Survey Results (historical surveys if separate from geoReports)
export const surveyResults = []; // Array; log past surveys (e.g., { x, y, potential, turn })

// Game Prices (current market prices; synced from prices.js, e.g., { crude: 39.81, gasoline: 125.6 })
export const gamePrices = {}; // Empty object; populated in bootstrap via initPrices

// Get Costs By Mode (adjusts base costs for mode; e.g., Engineer: 20% off)
export function getCostsByMode(mode) {
  const baseCosts = gameState.costs; // Reference from gameState
  const multipliers = {
    Gambler: 1.2, // Higher risk: +20% costs
    CEO: 1.0, // Balanced
    Engineer: 0.8 // Precision: -20% costs
  };
  const multiplier = multipliers[mode] || 1.0;
  return {
    drill: Math.round(baseCosts.drill * multiplier),
    survey: Math.round(baseCosts.survey * multiplier),
    well: Math.round(baseCosts.well * multiplier)
  };
}

// Get Random Cash Reason (random event reason for cash changes in nextTurn)
export function getRandomCashReason() {
  const reasons = [
    'Oil price spike! +$5000',
    'Unexpected maintenance: -$2000',
    'Investor boost: +$3000',
    'Labor strike: -$1500',
    'Refinery upgrade rebate: +$1000',
    'Market dip: -$800'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Loss Reasons (random events for cash losses in nextTurn)
export const lossReasons = [
  'Unexpected flood damage: -$3000',
  'Labor dispute: -$2500',
  'Equipment failure: -$4000',
  'Regulatory fine: -$1500',
  'Market crash: -$5000',
  'Supply chain delay: -$2000'
];

// Cash Reasons (general cash change reasons for turn modals)
export const cashReasons = [
  'Production bonus: +$2000',
  'Insurance claim: +$1500',
  'Cost overrun: -$1000',
  'Sales windfall: +$4000',
  'Tax break: +$800',
  'Unexpected fee: -$1200'
];