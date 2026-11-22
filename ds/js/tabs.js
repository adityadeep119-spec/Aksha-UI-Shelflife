// ds/js/tabs.js
function initTabs() {
  document.querySelectorAll('.ak-tabs').forEach(tabGroup => {
    const tabs = Array.from(tabGroup.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabGroup.querySelectorAll('[role="tabpanel"]'));

    function activateTab(selectedTab, moveFocus = true) {
      tabs.forEach(tab => {
        const isSelected = tab === selectedTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      });

      panels.forEach(panel => {
        if (panel.id === selectedTab.getAttribute('aria-controls')) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (moveFocus) selectedTab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab, false));

      tab.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') nextIndex = 0;
        if (e.key === 'End') nextIndex = tabs.length - 1;

        if (nextIndex !== null) {
          e.preventDefault();
          activateTab(tabs[nextIndex], true);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initTabs);