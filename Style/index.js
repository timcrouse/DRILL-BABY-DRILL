// Style/index.js - Dynamic loader for modular CSS files

const STYLE_FILES = [
  // Core layout (load upfront for instant UI)
  'global.css',
  'status-panel.css',
  'buttons.css',
  'grid.css',
  'well-data-bar.css',

  // Modals (shared first, then specifics—lazy-loadable)
  'shared-modals.css',
  'message-modal.css',
  'settings-modal.css',
  'purchase-order-modal.css',
  'decline-confirm-modal.css',
  'turn-note.css',

  // Specialized (lazy for geo reports)
  'geo-report.css'
];

/**
 * Dynamically loads all CSS files by creating <link> tags.
 * @returns {Promise<void>} Resolves when all styles are loaded.
 */
export async function loadAllStyles() {
  const promises = STYLE_FILES.map(filename => loadStyle(filename));
  try {
    await Promise.all(promises);
    console.log('All styles loaded successfully');
  } catch (error) {
    console.error('Error loading styles:', error);
    injectFallbackStyles(); // Inline backup
  }
}

/**
 * Loads a specific CSS file on demand (supports lazy-loading).
 * @param {string} filename - e.g., 'purchase-order-modal.css'
 * @returns {Promise<void>}
 */
export function loadStyle(filename) {
  if (!STYLE_FILES.includes(filename)) {
    throw new Error(`Unknown style file: ${filename}`);
  }
  return new Promise((resolve, reject) => {
    // Skip if already loaded
    if (document.querySelector(`link[href="./Style/${filename}"]`)) {
      return resolve(filename);
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./Style/${filename}`;
    link.onload = () => resolve(filename);
    link.onerror = () => reject(new Error(`Failed to load ${filename}`));
    document.head.appendChild(link);
  });
}

/**
 * Fallback: Inline minimal styles if loading fails.
 */
function injectFallbackStyles() {
  const fallbackCSS = `
    /* Basic fallback for layout and text */
    body { background: #111237; color: #b1d1ee; font-family: sans-serif; margin: 0; height: 100vh; }
    #container { display: flex; gap: 96px; padding: 20px; align-items: stretch; justify-content: center; }
    #props-panel { flex: 0 0 340px; border: 1px solid #b1d1ee; border-radius: 12px; padding: 20px; overflow-y: auto; }
    #gameUI { flex: 1; display: flex; flex-direction: column; }
    #grid-panel { flex: 1; background: #18234d; border-radius: 15px; padding: 12px; min-height: 450px; }
    #xy-grid { border-collapse: collapse; table-layout: fixed; width: 100%; min-height: 400px; }
    #xy-grid th, #xy-grid td { border: 1px solid #b1d1ee; width: 36px; height: 36px; text-align: center; background: #294368; }
    #xy-grid td.selected { border-width: 3px; border-color: #f7d860; }
    .yellow-value { color: #f7d860 !important; font-weight: bold; }
    .green-value { color: #089357 !important; font-weight: bold; }
    .main-btn { background: #232344; border: 2px solid #b1d1ee; color: #f7d860; padding: 6px 20px; cursor: pointer; border-radius: 8px; margin: 4px; }
    .main-btn:hover { background: #222867; border-color: #f7d860; color: #fff; }
    .geo-dot { width: 12px; height: 12px; border-radius: 50%; background: #ff8800; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    /* Modal fallback */
    #modalMessage, #settingsDialog, #purchaseOrderModal, #declineConfirmModal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(20,25,55,0.92); display: none; align-items: center; justify-content: center; z-index: 2000; }
    .modalBox, .settingsBox, .purchase-order, .decline-confirm { background: #1a2039; color: #b1d1ee; padding: 30px; border-radius: 18px; text-align: center; max-width: 600px; }
  `;
  const style = document.createElement('style');
  style.textContent = fallbackCSS;
  document.head.appendChild(style);
  console.log('Fallback styles injected');
}