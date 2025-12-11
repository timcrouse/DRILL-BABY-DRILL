// index.js - Root barrel export for the entire app

// Data: State, constants, init
export * from './Data/index.js';

// Utils: Helpers (e.g., getRandomElement)
export * from './Utils/index.js';

// UI: Render functions (e.g., updateGameUI, renderGrid)
export * from './UI/index.js';

// Actions: Game logic (e.g., drillWell, nextTurn, geoSurvey)
export * from './Actions/index.js';

// Style: CSS loaders
export * from './Style/index.js';

// Main app initializer
export { initApp } from './main.js';