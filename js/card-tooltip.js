document.addEventListener('mouseover', e => {
  const card = e.target.closest('.card');
  if (!card || card.contains(e.relatedTarget)) return;
  if (card.dataset.copy === '1') return;
  let url = '';
  try {
    url = decodeURIComponent(card.dataset.key || '');
  } catch {
    url = card.dataset.key || '';
  }
  if (!url || url === 'javascript:void(0);') return;
  let tooltip = card.querySelector('.card-url-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'card-url-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    card.appendChild(tooltip);
  }
  tooltip.textContent = url;
  card.classList.add('has-url-tooltip');
});

// Sub-page tabs should only switch their content and must not move the page.
document.addEventListener('click', e => {
  const tab = e.target.closest('[data-group][data-tab]');
  if (!tab) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if (typeof active === 'object' && active) {
    active[tab.dataset.group] = tab.dataset.tab;
  }
  if (typeof home === 'function') home();
}, true);
