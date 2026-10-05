const bookmarks = [
  {title:"Chi 的工具箱", url:"https://nav.chi.qzz.io/", description:"Chi 的個人網站導航", icon:"fa-solid fa-compass"},
  {title:"Google", url:"https://www.google.com/", description:"網路搜尋", icon:"fa-brands fa-google"},
  {title:"FB", url:"https://www.facebook.com/", description:"社群平台", icon:"fa-brands fa-facebook"},
  {title:"YT", url:"https://www.youtube.com/", description:"影音平台", icon:"fa-brands fa-youtube"},
  {title:"YT Music", url:"https://music.youtube.com/", description:"音樂串流", icon:"fa-brands fa-youtube"},
  {title:"bilibili", url:"https://www.bilibili.com/", description:"彈幕影音平台", icon:"fa-solid fa-play"},
  {title:"GitHub", url:"https://github.com/", description:"程式碼託管", icon:"fa-brands fa-github"},
  {title:"IG", url:"https://www.instagram.com/", description:"圖片與影音社群", icon:"fa-brands fa-instagram"},
  {title:"ChatGPT", url:"https://chatgpt.com/", description:"AI 助手", icon:"fa-solid fa-comments"},
  {title:"Threads", url:"https://www.threads.net/", description:"文字社群", icon:"fa-brands fa-threads"},
  {title:"Gmail", url:"https://mail.google.com/", description:"電子郵件", icon:"fa-solid fa-envelope"},
  {title:"Notion", url:"https://app.notion.com/", description:"筆記與知識管理", icon:"fa-solid fa-n"},
  {title:"Ente Auth", url:"https://auth.ente.com/", description:"2FA 驗證碼", icon:"fa-solid fa-shield-halved"},
  {title:"Raindrop.io", url:"https://app.raindrop.io/", description:"網頁書籤管理", icon:"fa-solid fa-bookmark"},
  {title:"Alist", url:"https://alist.chi.qzz.io", description:"雲端儲存整合", icon:"fa-solid fa-cloud"}
];

const grid = document.getElementById("bookmark-grid");
const search = document.getElementById("search-input");
const clear = document.getElementById("search-clear");
const empty = document.getElementById("empty-state");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = bookmarks.filter(item =>
    !query || [item.title, item.url, item.description].join(" ").toLowerCase().includes(query)
  );

  grid.innerHTML = visible.map(item => `
    <a class="card card-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
      <div class="card-main">
        <div class="card-logo-container">
          <i class="${escapeHtml(item.icon)} card-logo" aria-hidden="true"></i>
        </div>
        <div class="card-content">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-desc">${escapeHtml(item.description)}</div>
        </div>
      </div>
    </a>
  `).join("");

  empty.hidden = visible.length !== 0;
}

search.addEventListener("input", render);
clear.addEventListener("click", () => {
  search.value = "";
  render();
  search.focus();
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
  }
});

render();