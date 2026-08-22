(() => {
  const KEY = 'chi-nav-theme';
  const modes = ['light', 'dark', 'system'];
  const labels = { light: '亮色', dark: '暗色', system: '跟隨系統' };
  const icons = { light: 'fa-solid fa-sun', dark: 'fa-solid fa-moon', system: 'fa-solid fa-circle-half-stroke' };
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function getMode() {
    const saved = localStorage.getItem(KEY);
    return modes.includes(saved) ? saved : 'system';
  }

  function apply(mode) {
    const dark = mode === 'dark' || (mode === 'system' && media.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.themeMode = mode;
    const btn = document.querySelector('.theme-float button');
    if (btn) {
      btn.innerHTML = `<i class="${icons[mode]}"></i>`;
      btn.title = labels[mode];
      btn.setAttribute('aria-label', `外觀模式：${labels[mode]}，點擊切換`);
      btn.dataset.theme = mode;
    }
  }

  function createControl() {
    const box = document.createElement('div');
    box.className = 'theme-float';
    box.setAttribute('aria-label', '外觀模式');
    box.innerHTML = '<button type="button" aria-label="切換外觀模式"></button>';
    box.addEventListener('click', () => {
      const current = getMode();
      const next = modes[(modes.indexOf(current) + 1) % modes.length];
      localStorage.setItem(KEY, next);
      apply(next);
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
  }

  media.addEventListener?.('change', () => {
    if (getMode() === 'system') apply('system');
  });
  window.addEventListener('DOMContentLoaded', init);
  init();
})();
