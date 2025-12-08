/**
 * Hide all modals to return to gameplay
 */
export function hideAllModals() {
  document.getElementById('modalMessage').style.display = 'none';
  document.getElementById('purchaseOrderModal').style.display = 'none';
  document.getElementById('declineConfirmModal').style.display = 'none';
}