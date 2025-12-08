/* data/modes.js */
// Game mode descriptions and reasons

import { gameState } from './state.js';

export function getModeDesc(mode) {
  const descs = {
    Gambler: `Fortune favors the bold! Lower costs but surveys are less reliable with higher variance in estimates.<br><br>Drill: <span class="yellow-value">$1,000</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$3,000</span><br>Setting a Well: <span class="yellow-value">$15,000</span>`,
    CEO: `Balanced approach for strategic decisions. Moderate costs and survey accuracy.<br><br>Drill: <span class="yellow-value">$1,500</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$5,000</span><br>Setting a Well: <span class="yellow-value">$20,000</span>`,
    Engineer: `Precision and safety first. Higher costs but highly accurate surveys with low variance.<br><br>Drill: <span class="yellow-value">$3,000</span>/1,000 ft<br>Geophysical Survey: <span class="yellow-value">$7,000</span><br>Setting a Well: <span class="yellow-value">$25,000</span>`
  };
  return descs[mode] || '';
}

export const cashReasons = {
  Gambler: [
    "You hit the jackpot on oil futures at the casino – cha-ching!",
    "Won a high-stakes poker game with other tycoons!",
    "Found a lucky oil gusher while gambling in the desert!",
    "Bet on a wildcat well and it paid off big time!",
    "Lady Luck sent you a surprise check from an old bet!"
  ],
  CEO: [
    "Board approved a bonus for your 'strategic vision'!",
    "Government subsidy for 'green' initiatives – wink wink!",
    "Sold company swag at inflated prices!",
    "Quarterly profits from mysterious sources!",
    "Executive perk: Surprise cash from corporate slush fund!"
  ],
  Engineer: [
    "Patented a new drill bit – royalties pouring in!",
    "Efficiency savings from your latest invention!",
    "Grant for researching 'sustainable' oil extraction!",
    "Sold tech to a rival – they paid handsomely!",
    "Math error in your favor – extra funds calculated!"
  ]
};

export const lossReasons = {
  crude: "A mysterious spill – blame the seagulls!",
  refineries: "Refinery gremlins struck – equipment malfunction!",
  products: "Products vanished – alien abduction?"
};