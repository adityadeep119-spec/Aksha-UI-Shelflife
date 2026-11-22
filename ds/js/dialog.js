// ds/js/dialog.js
let activeDialog = null;
let lastFocusedTrigger = null;

function openDialog(dialogId, triggerEl = document.activeElement) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  lastFocusedTrigger = triggerEl;
  dialog.removeAttribute('hidden');
  dialog.setAttribute('aria-modal', 'true');
  activeDialog = dialog;

  const focusable = dialog.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length) focusable[0].focus();
}

function closeDialog(dialog) {
  const target = dialog || activeDialog;
  if (!target) return;
  target.setAttribute('hidden', '');
  activeDialog = null;
  if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
    lastFocusedTrigger.focus();
  }
}

document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-dialog-target]');
  if (openBtn) {
    openDialog(openBtn.getAttribute('data-dialog-target'), openBtn);
  }
  const closeBtn = e.target.closest('[data-dialog-close]');
  if (closeBtn) {
    closeDialog(closeBtn.closest('.ak-dialog'));
  }
});

document.addEventListener('keydown', (e) => {
  if (!activeDialog) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeDialog(activeDialog);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = Array.from(activeDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});