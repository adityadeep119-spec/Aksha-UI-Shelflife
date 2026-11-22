// ds/js/table-sort.js
function initTableSort() {
  document.querySelectorAll('.ak-table').forEach(table => {
    const headers = table.querySelectorAll('th[data-sort]');

    headers.forEach((header, colIndex) => {
      if (!header.hasAttribute('tabindex')) {
        header.setAttribute('tabindex', '0');
      }

      const sortColumn = () => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentOrder = header.getAttribute('aria-sort') || 'none';
        const newOrder = currentOrder === 'ascending' ? 'descending' : 'ascending';

        headers.forEach(h => h.setAttribute('aria-sort', 'none'));
        header.setAttribute('aria-sort', newOrder);

        rows.sort((rowA, rowB) => {
          const cellA = rowA.children[colIndex]?.textContent.trim() || '';
          const cellB = rowB.children[colIndex]?.textContent.trim() || '';
          return newOrder === 'ascending'
            ? cellA.localeCompare(cellB, undefined, { numeric: true })
            : cellB.localeCompare(cellA, undefined, { numeric: true });
        });

        rows.forEach(row => tbody.appendChild(row));
      };

      header.addEventListener('click', sortColumn);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sortColumn();
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initTableSort);