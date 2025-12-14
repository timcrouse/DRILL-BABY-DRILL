/**
 * @fileoverview main.js - App Entry Point
 * 
 * Purpose: This is the central entry point for the "Drill Baby Drill" oil management game.
 * It orchestrates modular initialization by importing and chaining key functions: bootstrap for
 * one-time setup (styles, prices, map, UI components, checkboxes) and event binding for user
 * interactions. It also exposes necessary functions globally on the `window` object to support
 * direct HTML `onclick` handlers, bridging modular code with legacy-style markup.
 * 
 * Key Features:
 * - Async onload handler ensures DOM readiness before setup.
 * - Comprehensive imports from submodules (Data for state/map, UI for rendering, Actions for game logic).
 * - Global exposures for modal/action handlers (e.g., confirmPurchase, showTurnModal).
 * - Error handling with user-friendly modals for failures.
 * - Logging for debugging (e.g., initialization steps).
 * 
 * Usage: Loaded via <script type="module" src="./main.js"></script> in index.html.
 * Triggers automatically on window.onload. Game starts with sample oil map data for demo.
 * 
 * Dependencies: 
 * - init.js (bootstrap), events.js (bindEvents).
 * - Data/index.js (gameState, generateOilMap), UI/index.js (renderGrid, updateGameUI), Actions/index.js (drillWell, nextTurn).
 * - prices.js, map.js (via Data/index.js), and CSS modules via Style/index.js.
 * - Leaflet.js (CDN-loaded in index.html for oil map).
 * 
 * Changes in This Update (v2.1 - Dec 13, 2025):
 * - Added sample oil data injection post-bootstrap for immediate map visualization (addresses 0-point log).
 * - Ensured generateOilMap is called with data if not already in bootstrap.
 * - Minor: Improved error modal styling; added timestamp to logs for traceability.
 * - Compatibility: Retained ES module/CommonJS flexibility; no breaking changes.
 * 
 * @author Refactored by Grok (xAI)
 * @version 2.1 - Enhanced with Sample Data & Map Integration
 */

// Core Imports
import { 
  selectedCell, 
  generateOilMap, 
  gameState, 
  getModeDesc 
} from './Data/index.js';
import { 
  renderGrid, 
  updateGameUI, 
  showModalMessage, 
  hideModalMessage 
} from './UI/index.js';
import { 
  drillWell, 
  setWell, 
  geoSurvey, 
  nextTurn,
  showTurnModal,
  buySelectedItems,
  confirmPurchase,
  confirmDecline,
  hidePurchaseOrder,
  hideDeclineConfirm,
  hideAllModals
} from './Actions/index.js';
import { loadAllStyles } from './Style/index.js'; // Kept for potential direct use, but mainly via bootstrap
import { getRandomElement } from './Utils/index.js';

// Modular Init and Events
import { bootstrap } from './init.js';
import { bindEvents } from './events.js';

/**
 * Sample oil well data for demo map population (Houston-area wells).
 * Add real data via API or gameState in production.
 */
const SAMPLE_OIL_DATA = [
  { lat: 29.7604, lng: -95.3698, name: 'Houston Central Well #1', production: 500 },
  { lat: 29.95, lng: -95.42, name: 'Katy Field Well #2', production: 800 },
  { lat: 30.05, lng: -94.12, name: 'Beaumont East Well #3', production: 1500 } // High-prod for icon demo
];

/**
 * Helper to expose functions globally for HTML onclick handlers.
 * This mimics original non-modular code while keeping logic modular.
 */
function exposeGlobals() {
  const globals = {
    showModalMessage,
    hideModalMessage,
    showTurnModal,
    buySelectedItems,
    confirmPurchase,
    confirmDecline,
    hidePurchaseOrder,
    hideDeclineConfirm,
    hideAllModals,
    updateTurnButtonLabel: () => console.log('updateTurnButtonLabel called') // Placeholder; export from Actions if needed
  };

  Object.entries(globals).forEach(([key, fn]) => {
    window[key] = fn;
  });

  console.log('Globals exposed for HTML handlers');
}

// Main Onload Handler: Chain setup and events
window.onload = async () => {
  const timestamp = new Date().toISOString().slice(11, 19); // HH:MM:SS for logs
  console.log(`window.onload triggered at ${timestamp} - Starting app initialization`);
  
  try {
    // Step 1: One-time bootstrap (styles, prices, map, UI, checkboxes)
    await bootstrap();
    
    // Step 2: Populate oil map with sample data if empty (enhances initial load)
    if (L && map && typeof generateOilMap === 'function') { // Ensure Leaflet/map ready
      const currentPoints = document.querySelectorAll('#oil-map-container .leaflet-marker-icon').length;
      if (currentPoints === 0) {
        console.log('Adding sample oil data to map...');
        await generateOilMap({ oilData: SAMPLE_OIL_DATA });
      }
    }
    
    // Step 3: Expose globals for direct HTML interactions
    exposeGlobals();
    
    // Step 4: Bind dynamic events (buttons, modals, etc.)
    bindEvents();
    
    // Step 5: Initial UI refresh (e.g., render grid, update prices)
    renderGrid();
    updateGameUI();
    
    console.log(`App fully initialized at ${timestamp} - Ready for interaction`);
  } catch (error) {
    const timestamp = new Date().toISOString().slice(11, 19);
    console.error(`Failed to initialize app at ${timestamp}:`, error);
    if (typeof showModalMessage === 'function') {
      showModalMessage(`<div class="error" style="color: red; font-weight: bold;">Initialization failed: ${error.message}.<br>Check console for details and refresh.</div>`);
    }
  }
};

// Optional: If a root barrel export is needed elsewhere, alias bootstrap
// export { bootstrap as initApp } from './init.js';