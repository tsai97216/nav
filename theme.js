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
    document.querySelectorAll('.theme-float button').forEach(btn => {
      const active = btn.dataset.theme === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function createControl() {
    const box = document.createElement('div');
    box.className = 'theme-float';
    box.setAttribute('aria-label', '外觀模式');
    box.innerHTML = `<button type="button" data-theme="light" title="亮色" aria-label="亮色"><i class="${icons.light}"></i><span>亮色</span></button><button type="button" data-theme="dark" title="暗色" aria-label="暗色"><i class="${icons.dark}"></i><span>暗色</span></button><button type="button" data-theme="system" title="跟隨系統" aria-label="跟隨系統"><i class="${icons.system}"></i><span>系統</span></button>`;
    box.addEventListener('click', e => {
      const btn = e.target.closest('button[data-theme]');
      if (!btn) return;
      const mode = btn.dataset.theme;
      localStorage.setItem(KEY, mode);
      apply(mode);
    });
    return box;
  }

  function createTopButton() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.title = '回到最上面';
    btn.setAttribute('aria-label', '回到最上面');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    return btn;
  }

  function init() {
    document.querySelector('.theme-control')?.remove();
    if (!document.querySelector('.floating-actions')) {
      const actions = document.createElement('div');
      actions.className = 'floating-actions';
      actions.append(createTopButton(), createControl());
      document.body.appendChild(actions);
    }
    apply(getMode());
    const top = document.querySelector('.back-to-top');
    const updateTop = () => top?.classList.toggle('visible', window.scrollY > 320);
    window.addEventListener('scroll', updateTop, { passive: true });
    updateTop();
  }

  media.addEventListener?.('change', () => {
    if (getMode() === 'system') apply('system');
  });
  window.addEventListener('DOMContentLoaded', init);
  init();
})();
