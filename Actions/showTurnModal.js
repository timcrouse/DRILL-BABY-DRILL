import { gameState, cashReasons } from './data.js';
import { getRandomElement } from './utils.js';
import { showModalMessage } from './ui.js';

/** Show Turn Modal */
export function showTurnModal() {
  const amount = gameState.cash; // Use current cash for display
  const reason = getRandomElement(cashReasons[gameState.mode]);

  const modalContent = `
    <div style="text-align: center; color: #b1d1ee;">
      <h2>Turn ${gameState.turn} Insurance and Process Improvement Options</h2>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <hr style="border: none; border-top: 1px solid #b1d1ee99; margin: 16px 0 8px;">
        <div class="section-title">Capital Injection</div>
        <div style="margin-bottom: 10px;">
          <span>Amount: <span class="yellow-value">$${amount.toLocaleString()}</span></span>
          <p style="margin: 4px 0 0;">${reason}</p>
        </div>
      </div>
      <br>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <div class="section-title">Turn Insurances</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Fire</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insFire" onclick="event.stopPropagation();" ${gameState.insurances.fire ? 'disabled' : ''}>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Flood</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insFlood" onclick="event.stopPropagation();" ${gameState.insurances.flood ? 'disabled' : ''}>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><span class="insurance-label">Labor</span> - Cost: <span class="yellow-value">$2000</span> - (<span class="yellow-value">$100</span>/Well, <span class="yellow-value">$200</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="insLabor" onclick="event.stopPropagation();" ${gameState.insurances.labor ? 'disabled' : ''}>
        </div>
      </div>
      <br>
      <div class="status-section" style="text-align: left; margin: 0 auto; width: 90%;">
        <div class="section-title">Process Improvement</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Crude Oil Flow Optimization, Cost: <span class="yellow-value">$3000</span> - (<span class="yellow-value">$150</span>/Well)</span>
          <input type="checkbox" class="custom-checkbox" id="procCrude" onclick="event.stopPropagation();">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Refinery Process Improvement, Cost: <span class="yellow-value">$3000</span> - (<span class="yellow-value">$150</span>/Refinery)</span>
          <input type="checkbox" class="custom-checkbox" id="procRef" onclick="event.stopPropagation();">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Geological Survey Modernization, Cost: <span class="yellow-value">$3000</span></span>
          <input type="checkbox" class="custom-checkbox" id="procGeo" onclick="event.stopPropagation();">
        </div>
      </div>
      <br>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button class="main-btn" onclick="window.buySelectedItems(); event.stopPropagation();">Buy</button>
        <button class="main-btn" onclick="window.confirmDecline();">Decline</button>
      </div>
      <br><br>
      <div class="turn-note" style="color: #f7d860; text-align: left; margin-top: 2em; margin-bottom: 1em;">
        NOTE: Turn ${gameState.turn} Insurance and Work-Flow Process Improvement options are only available through this Purchase Order and must be confirmed or declined to move forward with Turn ${gameState.turn} operations. Failure to respond will result in these modernizations being automatically declined for the current turn.
      </div>
    </div>
  `;
  showModalMessage(modalContent);
}