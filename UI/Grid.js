/* grid.js */
import {
  GRID_SIZE,
  wells,
  oilMap,
  geoReports,
  selectedCell
} from './data.js';

/**
 * Render the 10×10 grid:
 * - Yellow headers (Luckiest Guy via .yellow-value in CSS)
 * - Only border highlight on selection
 * - X or well icon + geo-dot
 * @param {Function} cellSelectCallback - Callback (x, y) to call on cell click
 */
export function renderGrid(cellSelectCallback) {
  let html = '<tr><th></th>';
  for (let x = 1; x <= GRID_SIZE; x++) {
    html += `<th class="yellow-value">${x}</th>`;
  }
  html += '</tr>';

  const wellSvg = document.getElementById('setWellBtn')?.innerHTML || '';

  for (let y = 1; y <= GRID_SIZE; y++) {
    html += `<tr><th class="yellow-value">${y}</th>`;
    for (let x = 1; x <= GRID_SIZE; x++) {
      const key       = `${x},${y}`;
      const cell      = wells[key] || {};
      const info      = oilMap[y-1]?.[x-1] || {};
      const drilled   = !!cell.drilled;
      const wellSet   = !!cell.well;
      const producing = !!cell.producing;
      const struck    = drilled && info.hasOil && cell.depth >= 2000 && cell.currentRate > 0;
      const hasGeo    = Boolean(geoReports[key]);
      const geoDot    = hasGeo ? '<span class="geo-dot"></span>' : '';

      let mark = '';
      if (wellSet) {
        mark = producing
          ? `<span class="well-icon">${wellSvg}</span>`
          : `<span class="well-icon" style="filter:saturate(0) brightness(0.7)">${wellSvg}</span>`;
      } else if (drilled) {
        mark = `<span class="cell-x ${struck ? 'x-struck' : 'x-dry'}">X</span>`;
      }
      mark += geoDot;

      const isSel = (selectedCell.x === x && selectedCell.y === y);
      const cls   = isSel ? 'selected' : '';

      html += `<td data-x="${x}" data-y="${y}" class="${cls}">${mark}</td>`;
    }
    html += '</tr>';
  }

  const grid = document.getElementById('xy-grid');
  if (grid) {
    grid.innerHTML = html;
    document.querySelectorAll('#xy-grid td').forEach(td => {
      td.onclick = () => {
        const x = +td.dataset.x;
        const y = +td.dataset.y;
        cellSelectCallback(x, y);
      };
    });
  }
}