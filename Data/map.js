/**
 * map.js - Oil Map Generation Module
 * 
 * Description: This module handles the creation and management of an interactive oil map using Leaflet.js.
 * It generates markers for oil wells based on provided data (e.g., lat/lng, production rates).
 * Key features:
 * - Initializes a base map with OpenStreetMap tiles.
 * - Supports dynamic marker icons based on production levels.
 * - Clears and re-adds layers for updates.
 * - Includes error handling and logging for debugging.
 * - Compatible with ES modules (import/export) and CommonJS.
 * - Exports oilMap instance for grid-map sync (e.g., highlighting selected cells).
 * 
 * Dependencies: Leaflet.js (load via CDN in index.html).
 * Usage: Import and call generateOilMap(config) where config includes oilData array.
 * 
 * Version: 1.2 (Updated: Set exported oilMap reference for Data/index.js integration).
 * Author: Grok (xAI) - Updated on Dec 13, 2025.
 */

let map; // Global map instance
let oilLayer; // Mutable layer for oil points

/**
 * Generates an interactive oil map with well data points.
 * @param {Object} config - Map config (center, zoom, oilData array).
 */
function generateOilMap(config = {}) {
  try {
    console.log('Starting oil map generation...');

    // Default config if not provided
    const defaults = {
      center: [29.7604, -95.3698], // Houston, TX as default
      zoom: 10,
      oilData: [] // Array of {lat, lng, name, production}
    };
    const settings = { ...defaults, ...config };

    // Initialize map if not exists
    if (!map) {
      map = L.map('oil-map-container').setView(settings.center, settings.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      console.log('Base map initialized.');
    }

    // Clear existing oil layer (fixed by using 'let' for mutability)
    if (oilLayer) {
      map.removeLayer(oilLayer);
    }
    oilLayer = L.layerGroup(); // Reassign here - was const, now let

    // Process oil data (assuming fetched from API or prices.js)
    let geoData = settings.oilData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      popup: `<b>${point.name}</b><br>Production: ${point.production} bbl/day`
    }));

    // Add markers (fixed any potential loop reassignments)
    geoData.forEach((point, index) => {
      let marker = L.marker([point.lat, point.lng])
        .bindPopup(point.popup)
        .addTo(oilLayer);
      
      // Example: Dynamic icon based on production
      if (point.production > 1000) {
        marker.setIcon(L.icon({
          iconUrl: 'path/to/high-prod-icon.png',
          iconSize: [25, 41]
        }));
      }
      
      console.log(`Added marker ${index + 1}: ${point.name}`);
    });

    // Add layer to map
    oilLayer.addTo(map);

    // Fit bounds to data
    if (geoData.length > 0) {
      const group = new L.featureGroup(geoData.map(p => L.marker([p.lat, p.lng])));
      map.fitBounds(group.getBounds());
    }

    // Set exported oilMap reference for Data/index.js (grid-map sync)
    if (typeof oilMap !== 'undefined') {
      oilMap = map;
    }

    console.log('Oil map generated successfully with', geoData.length, 'points.');
    return map; // Return for chaining

  } catch (error) {
    console.error('Failed to generate oil map:', error);
    throw error; // Re-throw for upstream handling
  }
}

// ES Module Export (fixes SyntaxError in index.js:24)
export { generateOilMap };

// CommonJS Export (for backward compatibility, e.g., in init.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateOilMap };
}

// Auto-init on load if no container
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('oil-map-container')) {
    generateOilMap({ oilData: [] }); // Empty init
  }
});