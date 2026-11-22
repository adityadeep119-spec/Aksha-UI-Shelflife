// ds/js/toast.js
function showToast(message, type = 'info') {
  let container = document.querySelector('.ak-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'ak-toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `ak-toast ak-toast-${type}`;
  if (type === 'error') toast.setAttribute('role', 'alert');

  const span = document.createElement('span');
  span.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'ak-button sm secondary';
  closeBtn.textContent = 'Dismiss';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(span);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4500);
}