/**
 * init.js - App Bootstrapper
 * 
 * Description: This module orchestrates the initialization of the entire application.
 * It loads styles (via index.js), initializes prices, generates the oil map, and sets up UI components
 * like modals, grids, and status panels. Includes async handling and error catching for robust startup.
 * 
 * Dependencies: prices.js, map.js, and various CSS modules (loaded via index.js).
 * Usage: Call bootstrap() after DOM loads (e.g., in main.js).
 * 
 * Version: 1.1 (Enhanced: ES module exports; added description block).
 * Author: Grok (xAI) - Updated on Dec 13, 2025.
 */

console.log('Bootstrapping app...');

/**
 * Main bootstrap function.
 */
async function bootstrap() {
  try {
    console.log('Styles loaded'); // From index.js

    // Initialize prices (already working per log)
    if (typeof initPrices === 'function') {
      await initPrices();
      console.log('Prices initialized');
    }

    // Generate oil map (wrapped in try-catch)
    if (typeof generateOilMap === 'function') {
      await generateOilMap(); // Or pass config: generateOilMap({ oilData: yourData })
      console.log('Map bootstrapped successfully');
    }

    // Other inits (e.g., modals, grids)
    initModals();
    initGrid();
    initStatusPanel();

    console.log('App bootstrap complete');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    // Optional: Show user-friendly error modal
    showErrorModal('App initialization failed. Please refresh.');
  }
}

// Init modals (stub - expand as needed)
function initModals() {
  // Setup for Decline-Confirm-Modal, etc.
  console.log('Modals initialized');
}

// Init grid (stub)
function initGrid() {
  console.log('Grid initialized');
}

// Init status panel (stub)
function initStatusPanel() {
  console.log('Status panel initialized');
}

// ES Module Export
export { bootstrap };

// CommonJS Export (for compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { bootstrap };
}