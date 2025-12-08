// hideModalMessage.js
// Standalone function to hide the modal message, extracted for modularity.
// Assumes a modal with id 'modalMessage' exists in the DOM.

window.hideModalMessage = function() {
  const modal = document.getElementById('modalMessage');
  if (modal) {
    modal.style.display = 'none';
  }
};