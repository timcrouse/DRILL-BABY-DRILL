// init.js - One-time app setup: Styles, data, UI render

import { loadAllStyles } from './Style/index.js';
import { generateOilMap } from './Data/index.js';
import { updateGameUI, showModalMessage } from './UI/index.js';

/**
 * Runs async bootstrap: Load styles, init data/UI, reset checkboxes.
 */
export async function bootstrap() {
  try {
    console.log('Bootstrapping app...');

    // Step 1: Load styles
    await loadAllStyles();
    console.log('Styles loaded');

    // Step 2: Initialize data
    generateOilMap();
    console.log('Data initialized');

    // Step 3: Render initial UI
    updateGameUI();
    console.log('UI rendered');

    // Step 4: Reset insurance checkboxes (from original)
    document.querySelectorAll('.insurance-box').forEach(cb => cb.checked = false);

    console.log('Bootstrap complete');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    showModalMessage('<div class="error">App bootstrap error—check console.</div>');
  }
}