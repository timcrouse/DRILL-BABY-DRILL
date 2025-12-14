/**
 * @fileoverview UI/Grid.js - Grid Renderer
 * 
 * Purpose: Dynamically generates and renders the 10x10 game grid as an HTML table, including
 * headers, cell marks (X for drilled, well icons, geo dots), and selection highlighting.
 * Binds click events to cells for selection, invoking a provided callback with (x, y) coordinates.
 * Integrates with game state for visual indicators (e.g., struck oil, producing wells).
 * 
 * Key Features:
 * - Builds HTML string for efficient DOM insertion (avoids slow loops).
 * - Uses SVG from #setWellBtn for well icons (with desaturation for non-producing).
 * - Applies classes for CSS styling (e.g., 'selected', 'x-struck').
 * - Optional callback for cell selection (e.g., update UI or well data on click).
 * 
 * Changes in Refactor:
 * - Updated imports to modular barrels (e.g., '../Data/index.js' instead of './data.js').
 * - Made cellSelectCallback optional: If not provided, logs selection but doesn't trigger re-renders.
 * - Added null checks for grid element and SVG source.
 * - Improved event delegation: Uses data attributes and parses with + for safety.
 * - Added console logging for debugging (e.g., missing elements).
 * - Ensured no recursion: Caller (e.g., updateGameUI) can pass null callback; handle updates externally.
 * 
 * Dependencies: Data/ for grid constants/state (GRID_SIZE, oilMap, etc.), CSS for classes (.yellow-value, .geo-dot).
 * 
 * Usage: Call renderGrid(callback?) from updateGameUI or actions. Export via UI/index.js.
 * Example: renderGrid((x, y) => { selectedCell.x = x; selectedCell.y = y; updateWellDataBar(); });
 * 
 * @exports {function} renderGrid - Renders the grid table and binds clicks.
 */

// Modular Imports (adjusted for UI/ subdirectory)
import { 
  GRID_SIZE,
  wells,
  oilMap,
  geoReports,
  selectedCell
} from '../Data/index.js'; // Barrel from parent Data/

const WELL_SVG_ID = 'setWellBtn'; // ID of element containing well SVG

/**
 * Render the 10×10 grid with headers, cell marks (X/well/geo), and selection.
 * Binds onclick to cells, calling callback(x, y) if provided.
 * @param {Function} [cellSelectCallback] - Optional callback invoked on cell click: (x, y) => void
 */
export function renderGrid(cellSelectCallback = null) {
  // Validate callback
  if (cellSelectCallback && typeof cellSelectCallback !== 'function') {
    console.warn('renderGrid: cellSelectCallback must be a function; ignoring.');
    cellSelectCallback = null;
  }

  let html = '<tr><th></th>'; // Row header
  for (let x = 1; x <= GRID_SIZE; x++) {
    html += `<th class="yellow-value">${x}</th>`;
  }
  html += '</tr>';

  // Fetch well SVG once (fallback to empty if missing)
  const wellSvg = document.getElementById(WELL_SVG_ID)?.innerHTML || '<svg>...</svg>'; // Placeholder if needed

  for (let y = 1; y <= GRID_SIZE; y++) {
    html += `<tr><th class="yellow-value">${y}</th>`;
    for (let x = 1; x <= GRID_SIZE; x++) {
      const key = `${x},${y}`;
      const cell = wells[key] || {};
      const info = oilMap[y - 1]?.[x - 1] || {};
      const drilled = !!cell.drilled;
      const wellSet = !!cell.well;
      const producing = !!cell.producing;
      const struck = drilled && info.hasOil && cell.depth >= 2000 && cell.currentRate > 0;
      const hasGeo = Boolean(geoReports[key]);
      const geoDot = hasGeo ? '<span class="geo-dot"></span>' : '';

      let mark = '';
      if (wellSet) {
        const svgStyle = producing ? '' : 'filter: saturate(0) brightness(0.7);';
        mark = `<span class="well-icon" style="${svgStyle}">${wellSvg}</span>`;
      } else if (drilled) {
        mark = `<span class="cell-x ${struck ? 'x-struck' : 'x-dry'}">X</span>`;
      }
      mark += geoDot;

      const isSelected = (selectedCell.x === x && selectedCell.y === y);
      const cellClass = isSelected ? 'selected' : '';

      html += `<td data-x="${x}" data-y="${y}" class="${cellClass}">${mark}</td>`;
    }
    html += '</tr>';
  }

  const gridElement = document.getElementById('xy-grid');
  if (gridElement) {
    gridElement.innerHTML = html;

    // Bind clicks post-render
    const cells = gridElement.querySelectorAll('td');
    cells.forEach(td => {
      td.onclick = () => {
        const x = +td.dataset.x; // Coerce to number
        const y = +td.dataset.y;
        if (isNaN(x) || isNaN(y)) {
          console.warn('Invalid cell coordinates:', td.dataset);
          return;
        }

        // Update selection state (always, for highlighting)
        selectedCell.x = x;
        selectedCell.y = y;

        // Invoke callback if provided (e.g., for UI updates)
        if (cellSelectCallback) {
          try {
            cellSelectCallback(x, y);
          } catch (error) {
            console.error('Error in cellSelectCallback:', error);
          }
        } else {
          console.log(`Grid cell selected: (${x}, ${y})`); // Debug log
        }

        // Re-highlight selected cell (in case callback changes state)
        cells.forEach(cell => {
          const cellX = +cell.dataset.x;
          const cellY = +cell.dataset.y;
          cell.classList.toggle('selected', cellX === x && cellY === y);
        });
      };
    });

    console.log(`Grid rendered: ${GRID_SIZE}x${GRID_SIZE} cells bound`);
  } else {
    console.error('Missing DOM element: #xy-grid');
  }
}