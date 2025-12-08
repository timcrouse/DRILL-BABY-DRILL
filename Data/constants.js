/* data/constants.js */
// Static constants for the game

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

export const GRID_SIZE = 10;