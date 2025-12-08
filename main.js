/* main.js */
import { selectedCell, generateOilMap, gameState, getModeDesc }       from './data.js';
import { renderGrid, updateGameUI, showModalMessage, hideModalMessage } from './ui.js';
import { drillWell, setWell, geoSurvey, nextTurn }                      from './actions.js';

window.onload = () => {
  console.log('window.onload triggered');

  // Add this at the end of window.onload
  document.querySelectorAll('.insurance-box').forEach(cb => cb.checked = false);

  generateOilMap();
  updateGameUI();
};

document.getElementById('drillBtn').onclick     = () => drillWell(selectedCell.x, selectedCell.y);
document.getElementById('setWellBtn').onclick   = () => setWell(selectedCell.x, selectedCell.y);
document.getElementById('geoSurveyBtn').onclick = () => geoSurvey(selectedCell.x, selectedCell.y);

document.getElementById('nextTurnBtn').onclick  = () => {
  console.log('nextTurnBtn clicked');
  gameState.turn += 1; // Increment turn to start at Turn 1
  nextTurn();
};
document.getElementById('accountingBtn').onclick= () => showModalMessage('Accounting coming soon');

document.getElementById('settingsBtn').onclick = () => {
  document.getElementById('settingsDialog').style.display='flex';
  document.getElementById('modeDesc').innerHTML = getModeDesc(gameState.mode);
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('selected', b.dataset.mode === gameState.mode));
};
document.getElementById('closeSettingsBtn').onclick = () => document.getElementById('settingsDialog').style.display='none';
document.getElementById('resetBtn').onclick = () => { generateOilMap(); updateGameUI(); };

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.onclick = () => {
    gameState.mode = btn.dataset.mode;
    updateGameUI();
    document.getElementById('modeDesc').innerHTML = getModeDesc(gameState.mode);
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };
});

// Prevent modal closure on clicking inside modal content
document.getElementById('modalMsgContent').addEventListener('click', (event) => {
  event.stopPropagation();
});
document.getElementById('purchaseOrderModal').addEventListener('click', (event) => {
  if (event.target === document.getElementById('purchaseOrderModal')) {
    window.hidePurchaseOrder();
  }
});