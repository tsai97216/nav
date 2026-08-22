(() => {
  const KEY = 'chi-nav-theme';
  const modes = { light: '亮色', dark: '暗色', system: '跟隨系統' };
  const icons = { light: 'fa-solid fa-sun', dark: 'fa-solid fa-moon', system: 'fa-solid fa-circle-half-stroke' };
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function getMode() {
    const saved = localStorage.getItem(KEY);
    return saved && modes[saved] ? saved : 'system';
  }

  function apply(mode) {
    const dark = mode === 'dark' || (mode === 'system' && media.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.themeMode = mode;
    document.querySelectorAll('.theme-switch button').forEach(btn => {
      const active = btn.dataset.theme === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function renderControl() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || document.querySelector('.theme-control')) return;
    const box = document.createElement('div');
    box.className = 'theme-control';
    box.innerHTML = `<span class="theme-label">外觀</span><div class="theme-switch" role="group" aria-label="選擇外觀"><button type="button" data-theme="light" title="亮色"><i class="${icons.light}"></i><span>亮色</span></button><button type="button" data-theme="dark" title="暗色"><i class="${icons.dark}"></i><span>暗色</span></button><button type="button" data-theme="system" title="跟隨系統"><i class="${icons.system}"></i><span>系統</span></button></div>`;
    sidebar.appendChild(box);
    box.addEventListener('click', e => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      const mode = btn.dataset.theme;
      localStorage.setItem(KEY, mode);
      apply(mode);
    });
  }

  function init() {
    renderControl();
    apply(getMode());
  }

  media.addEventListener?.('change', () => {
    if (getMode() === 'system') apply('system');
  });

  const observer = new MutationObserver(() => renderControl());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', init);
  init();
})();
