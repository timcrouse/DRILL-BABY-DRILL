/**
 * @fileoverview UI/index.js - UI Module Barrel Exports
 * 
 * Purpose: Central re-export hub for all UI-related functions and components.
 * Aggregates exports from individual UI files (GameUI.js, Grid.js, Modal.js, WellDataBar.js)
 * to allow clean imports from main.js or other modules (e.g., import { updateGameUI } from './UI/index.js').
 * Ensures modularity without deep imports.
 * 
 * Key Features:
 * - Re-exports all public functions (e.g., renderGrid, showModalMessage).
 * - No logic here—just barrel for convenience.
 * 
 * Dependencies: Individual UI files in this directory.
 * 
 * Usage: Import from this file in main.js or elsewhere.
 */

// Re-exports from GameUI.js
export { updateGameUI } from './GameUI.js';

// Re-exports from Grid.js
export { renderGrid } from './Grid.js';

// Re-exports from Modal.js
export { showModalMessage, hideModalMessage } from './Modal.js';

// Re-exports from WellDataBar.js (if any public exports; adjust as needed)
export { updateWellDataBar } from './WellDataBar.js'; // Example; add actual exports