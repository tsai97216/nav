(() => {
  // 左側只保留真正的大分類，細分類留在右側各區塊內分頁。
  const groups = [
    { id: "遊戲", icon: "fas fa-gamepad", target: "section-遊戲" },
    { id: "娛樂 & 社群", icon: "fas fa-film", target: "section-二次元" },
    { id: "AI & 搜尋", icon: "fas fa-microchip", target: "section-AI" },
    { id: "工具", icon: "fas fa-screwdriver-wrench", target: "section-檔案" },
    { id: "開發 & 服務", icon: "fas fa-code", target: "section-開發" }
  ];

  function setup() {
    const nav = document.getElementById("js-nav-menu");
    if (!nav) return;

    const favorite = nav.querySelector('.quick-nav[data-quick="favorites"]');
    const recent = nav.querySelector('.quick-nav[data-quick="recent"]');

    let html = `<a class="nav-item active" href="#home" data-group-target="home"><i class="fa-solid fa-house"></i><span>首頁</span></a>`;

    // 我的收藏固定在最上方，緊接首頁。
    if (favorite) html += '<div class="nav-divider"></div>' + favorite.outerHTML;

    html += '<div class="nav-divider"></div>' + groups.map(g =>
      `<a class="nav-item section-nav" href="#" data-group-target="${g.target}"><i class="${g.icon}"></i><span>${g.id}</span></a>`
    ).join("");

    // 最近使用放在分類之後，避免與主要分類混在一起。
    if (recent) html += '<div class="nav-divider"></div>' + recent.outerHTML;

    nav.innerHTML = html;

    nav.querySelectorAll("[data-group-target]").forEach(item => item.addEventListener("click", e => {
      e.preventDefault();
      const target = item.dataset.groupTarget;
      if (target === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));

    const updateActive = () => {
      const y = window.scrollY + Math.min(window.innerHeight * 0.25, 180);
      let active = "home";
      for (const g of groups) {
        const el = document.getElementById(g.target);
        if (el && el.offsetTop <= y) active = g.target;
      }
      nav.querySelectorAll("[data-group-target]").forEach(item => item.classList.toggle("active", item.dataset.groupTarget === active));
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(setup, 100));
  else setTimeout(setup, 100);
})();
