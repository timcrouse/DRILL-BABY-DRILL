/**
 * Hide the decline confirmation modal
 */
export function hideDeclineConfirm() {
  const declineModal = document.getElementById('declineConfirmModal');
  if (declineModal) {
    declineModal.style.display = 'none';
  }
}