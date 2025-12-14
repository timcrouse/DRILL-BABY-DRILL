/**
 * @fileoverview Style/index.js - Style Module Exports
 * 
 * Purpose: Handles dynamic loading of all CSS stylesheets for the app.
 * Exports loadAllStyles() to bootstrap styles without hardcoding <link> tags in HTML.
 * Loads files from this directory (e.g., Global.css, Grid.css).
 * 
 * Key Features:
 * - Async function to inject <link> elements for each CSS file.
 * - Error handling per file with console warnings.
 * - Supports modular CSS organization.
 * 
 * Dependencies: CSS files in this directory.
 * 
 * Usage: Await loadAllStyles() in init.js/bootstrap().
 */

// List of CSS files to load (match your directory)
const CSS_FILES = [
  'Buttons.css',
  'Decline-Confirm-Modal.css',
  'Geo-Report.css',
  'Global.css',
  'Grid.css',
  'Message-Modal.css',
  'Purchase-Order-Modal.css',
  'Settings-Modal.css',
  'Shared-Modals.css',
  'Status-Panel.css',
  'Turn-Note.css',
  'Well-Data-Bar.css'
];

/**
 * Dynamically loads all CSS files by creating <link> elements.
 * @returns {Promise<void>} Resolves when all styles are loaded.
 */
export async function loadAllStyles() {
  const promises = CSS_FILES.map(filename => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `./Style/${filename}`; // Relative to root (adjust if served from subdir)
      link.onload = () => {
        console.log(`Loaded: ${filename}`);
        resolve();
      };
      link.onerror = (err) => {
        console.warn(`Failed to load CSS: ${filename}`, err);
        resolve(); // Don't block on failure
      };
      document.head.appendChild(link);
    });
  });

  await Promise.all(promises);
  console.log('All styles loaded');
}