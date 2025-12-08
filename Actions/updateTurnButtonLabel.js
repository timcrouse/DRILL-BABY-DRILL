/**
 * Update the turn button label to "Next Turn"
 */
export function updateTurnButtonLabel() {
  const turnButton = document.getElementById('nextTurnBtn');
  if (turnButton) {
    turnButton.textContent = 'Next Turn';
  }
}