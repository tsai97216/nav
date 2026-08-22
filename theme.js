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

  function createControl() {
    const box = document.createElement('div');
    box.className = 'theme-control';
    box.innerHTML = `<span class="theme-label">外觀</span><div class="theme-switch" role="group" aria-label="選擇外觀"><button type="button" data-theme="light" title="亮色"><i class="${icons.light}"></i><span>亮色</span></button><button type="button" data-theme="dark" title="暗色"><i class="${icons.dark}"></i><span>暗色</span></button><button type="button" data-theme="system" title="跟隨系統"><i class="${icons.system}"></i><span>系統</span></button></div>`;
    box.addEventListener('click', e => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      const mode = btn.dataset.theme;
      localStorage.setItem(KEY, mode);
      apply(mode);
    });
    return box;
  }

  let control = null;
  function placeControl() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('.site-footer');
    if (!sidebar || !footer) return;
    if (!control) control = createControl();
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const target = mobile ? footer : sidebar;
    if (control.parentElement !== target) target.appendChild(control);
    apply(getMode());
  }

  function init() {
    placeControl();
    apply(getMode());
  }

  media.addEventListener?.('change', () => {
    if (getMode() === 'system') apply('system');
  });
  window.addEventListener('resize', placeControl);
  window.addEventListener('DOMContentLoaded', init);
  init();
})();
