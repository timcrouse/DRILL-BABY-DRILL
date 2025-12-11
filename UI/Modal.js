/* modal.js */
const _modal   = document.getElementById('modalMessage');
const _content = document.getElementById('modalMsgContent');

// Generic show/hide
export function showModal(html) {
  console.log('showModal called with html length:', html.length);
  if (_modal && _content) {
    _content.innerHTML = html;
    _modal.style.display = 'flex';
  } else {
    console.error('Modal elements not found in showModal');
  }
}

export function hideModal() {
  console.log('hideModal called');
  if (_modal) {
    _modal.style.display = 'none';
  } else {
    console.error('Modal element not found in hideModal');
  }
}

window.hideModal = hideModal; // Expose to global scope for HTML onclick

// Specialized geo-report dialog
export function showGeoReport(htmlReport) {
  showModal(`
    <div class="geo-report-container">
      ${htmlReport}
    </div>
    <button class="main-btn" onclick="hideModal()">Close</button>
  `);
}