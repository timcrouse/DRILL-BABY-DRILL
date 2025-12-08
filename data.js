/* data.js */
import { randomWithVariance } from './utils.js';

// Price ranges ...
export const PRICE_RANGES = {
  crude:     { min:11.27, max:133.96 },
  gasoline:  { min:81.48, max:211.34 },
  diesel:    { min:100.46, max:241.67 },
  ethanol:   { min:69.26, max:179.64 },
  biodiesel: { min:75.35, max:181.25 }
};

export const REFINERY_TIERS = [
  { id:'small',  label:'Small',  cost:150_000, throughput:750  },
  { id:'medium', label:'Medium', cost:300_000, throughput:1500 },
  { id:'large',  label:'Large',  cost:500_000, throughput:3000 }
];

export function initPrices() {
  const p = {
    crude:    randomWithVariance(PRICE_RANGES.crude),
    gasoline: randomWithVariance(PRICE_RANGES.gasoline),
    diesel:   randomWithVariance(PRICE_RANGES.diesel)
  };
  p.ethanol   = +(p.gasoline * 0.85).toFixed(2);
  p.biodiesel = +(p.diesel   * 0.75).toFixed(2);
  return p;
}
export const gamePrices = initPrices();

// Grid size
export const GRID_SIZE = 10;

// Game state
export let gameState = {
  turn: 0, // Initialize at Turn 0
  cash: 100000,
  crude: 0,
  refineries: { small:1, medium:0, large:0 },
  gasoline: 0,
  diesel: 0,
  biogasoline: 0,
  biodiesel: 0,
  mode: 'CEO',
  insurances: { fire: false, flood: false, labor: false }
};

export let oilMap = [];
export let wells = {};
export let geoReports = {};
export let selectedCell = { x:1, y:1 };

export function getCostsByMode() {
  const m = gameState.mode;
  return {
    drill:   m==='Gambler'?1000: m==='Engineer'?3000:1500,
    setWell: m==='Gambler'?15000:m==='Engineer'?25000:20000,
    survey:  m==='Gambler'?3000: m==='Engineer'?7000: 5000
  };
}

export function generateOilMap() {
  oilMap = Array.from({length:GRID_SIZE}, () =>
    Array.from({length:GRID_SIZE}, () => ({ hasOil: Math.random()<0.5 }))
  );
  wells = {};
  geoReports = {};
}

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