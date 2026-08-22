const navMenu = document.getElementById("js-nav-menu");
const mainContent = document.getElementById("js-main-content");
const quickSections = document.getElementById("quick-sections");
const searchInput = document.getElementById("search-input");
const resultInfo = document.getElementById("search-result-info");

const FAVORITES_KEY = "chi-nav-favorites";
const RECENT_KEY = "chi-nav-recent";
const RECENT_LIMIT = 8;

let sections = [];
let allLinks = [];
const linkMap = new Map();
let favorites = new Set(loadStorage(FAVORITES_KEY));
let recent = loadStorage(RECENT_KEY);

const fallbackColors = [
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#10b981,#047857)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#14b8a6,#0f766e)",
  "linear-gradient(135deg,#ef4444,#b91c1c)"
];

function loadStorage(key){
  try{
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  }catch(e){ return []; }
}

function saveStorage(key,value){
  try{ localStorage.setItem(key,JSON.stringify(value)); }catch(e){}
}

function linkKey(link){ return `${link.title}||${link.url}`; }

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));
}

function colorFor(title){
  let hash=0;
  for(let i=0;i<title.length;i++) hash=title.charCodeAt(i)+((hash<<5)-hash);
  return fallbackColors[Math.abs(hash)%fallbackColors.length];
}

function getDomain(url){
  try{ return url.startsWith("http") ? new URL(url).hostname : ""; }
  catch(e){ return ""; }
}

function createCard(link){
  const key=linkKey(link);
  const domain=getDomain(link.url);
  const favorite=favorites.has(key);
  const title=escapeHtml(link.title);
  const description=escapeHtml(link.description||"");
  const letter=escapeHtml((link.title||"?").charAt(0));
  const favicon=domain
    ? `<img class="card-logo" src="https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`
    : "";
  const fallback=`<span class="avatar-fallback" style="${domain?"display:none":""}">${letter}</span>`;
  const copy=link.is_copy ? "true" : "false";
  const copyBadge=link.is_copy ? `<span class="copy-badge"><i class="fa-regular fa-copy"></i> 腳本</span>` : "";

  return `<article class="card" data-key="${encodeURIComponent(key)}" data-url="${escapeHtml(link.url)}" data-copy-enabled="${copy}" data-search="${escapeHtml(`${link.title} ${link.description||""}`.toLowerCase())}">
    <button class="favorite-btn ${favorite?"is-favorite":""}" type="button" aria-label="${favorite?"取消收藏":"加入收藏"}" title="${favorite?"取消收藏":"加入收藏"}"><i class="fa-${favorite?"solid":"regular"} fa-star"></i></button>
    ${copyBadge}
    <div class="card-top">
      <div class="card-logo-container" style="background:${colorFor(link.title||"?")}">${favicon}${fallback}</div>
      <div class="card-title">${title}</div>
    </div>
    ${description ? `<div class="card-desc">${description}</div>` : ""}
  </article>`;
}

function renderNav(){
  navMenu.innerHTML="";
  if(favorites.size || recent.length) navMenu.insertAdjacentHTML("beforeend","<div class=\"nav-divider\"></div>");

  if(favorites.size){
    const a=document.createElement("a");
    a.className="nav-item quick-nav";a.href="#section-favorites";
    a.innerHTML='<i class="fa-solid fa-star"></i><span>我的收藏</span>';
    navMenu.appendChild(a);
  }
  if(recent.length){
    const a=document.createElement("a");
    a.className="nav-item quick-nav";a.href="#section-recent";
    a.innerHTML='<i class="fa-solid fa-clock-rotate-left"></i><span>最近使用</span>';
    navMenu.appendChild(a);
  }
  if(favorites.size || recent.length) navMenu.insertAdjacentHTML("beforeend","<div class=\"nav-divider\"></div>");

  sections.forEach((section,index)=>{
    const a=document.createElement("a");
    a.className="nav-item category-nav"+(index===0?" active":"");
    a.href=`#section-${index}`;
    a.innerHTML=`<i class="${escapeHtml(section.icon)}"></i><span>${escapeHtml(section.taxonomy)}</span>`;
    navMenu.appendChild(a);
  });
}

function renderQuickSections(){
  const favoriteLinks=allLinks.filter(link=>favorites.has(linkKey(link)));
  const recentLinks=recent.map(key=>linkMap.get(key)).filter(Boolean);
  let html="";

  if(favoriteLinks.length){
    html+=`<section class="section quick-section" id="section-favorites"><div class="section-header"><i class="fa-solid fa-star"></i><span>我的收藏</span></div><div class="grid">${favoriteLinks.map(createCard).join("")}</div></section>`;
  }
  if(recentLinks.length){
    html+=`<section class="section quick-section" id="section-recent"><div class="section-header"><i class="fa-solid fa-clock-rotate-left"></i><span>最近使用</span></div><div class="grid">${recentLinks.map(createCard).join("")}</div></section>`;
  }
  quickSections.innerHTML=html;
  renderNav();
}

function renderContent(){
  mainContent.innerHTML="";
  sections.forEach((section,index)=>{
    const sectionEl=document.createElement("section");
    sectionEl.className="section";
    sectionEl.id=`section-${index}`;

    let html=`<div class="section-header"><i class="${escapeHtml(section.icon)}"></i><span>${escapeHtml(section.taxonomy)}</span></div>`;

    if(Array.isArray(section.list)){
      section.list.forEach(group=>{
        const links=Array.isArray(group.links)?group.links:[];
        if(!links.length)return;
        html+=`<div class="term-container"><div class="term-title">${escapeHtml(group.term||"")}</div><div class="grid">${links.map(createCard).join("")}</div></div>`;
      });
    }else if(Array.isArray(section.links)){
      html+=`<div class="grid">${section.links.map(createCard).join("")}</div>`;
    }
    sectionEl.innerHTML=html;
    mainContent.appendChild(sectionEl);
  });
}

function refreshFavoriteButtons(){
  document.querySelectorAll(".favorite-btn").forEach(button=>{
    const card=button.closest(".card");
    if(!card)return;
    const key=decodeURIComponent(card.dataset.key||"");
    const active=favorites.has(key);
    button.classList.toggle("is-favorite",active);
    button.setAttribute("aria-label",active?"取消收藏":"加入收藏");
    button.title=active?"取消收藏":"加入收藏";
    button.innerHTML=`<i class="fa-${active?"solid":"regular"} fa-star"></i>`;
  });
}

function toggleFavorite(link){
  const key=linkKey(link);
  if(favorites.has(key)) favorites.delete(key); else favorites.add(key);
  saveStorage(FAVORITES_KEY,[...favorites]);
  renderQuickSections();
  refreshFavoriteButtons();
  applySearch(searchInput.value);
}

function addRecent(link){
  const key=linkKey(link);
  recent=[key,...recent.filter(item=>item!==key)].slice(0,RECENT_LIMIT);
  saveStorage(RECENT_KEY,recent);
  renderQuickSections();
}

function applySearch(value){
  const query=value.trim().toLowerCase();
  let count=0;

  quickSections.style.display=query?"none":"block";

  document.querySelectorAll(".section:not(.quick-section)").forEach(section=>{
    let sectionCount=0;

    section.querySelectorAll(".term-container").forEach(term=>{
      let termCount=0;
      term.querySelectorAll(".card").forEach(card=>{
        const text=card.dataset.search||"";
        const match=!query||text.includes(query);
        card.style.display=match?"":"none";
        if(match){termCount++;count++;}
      });
      term.style.display=termCount?"":"none";
      sectionCount+=termCount;
    });

    const grid=section.querySelector(":scope > .grid");
    if(grid){
      grid.querySelectorAll(".card").forEach(card=>{
        const text=card.dataset.search||"";
        const match=!query||text.includes(query);
        card.style.display=match?"":"none";
        if(match){sectionCount++;count++;}
      });
    }

    section.style.display=sectionCount?"":"none";
    const nav=document.querySelector(`.category-nav[href="#${section.id}"]`);
    if(nav)nav.style.display=sectionCount?"":"none";
  });

  if(query){
    resultInfo.textContent=`找到 ${count} 個結果`;
    resultInfo.style.display="inline";
  }else{
    resultInfo.textContent="";
    resultInfo.style.display="none";
    document.querySelectorAll(".category-nav").forEach(nav=>nav.style.display="");
  }
}

function setActiveNav(){
  const visibleSections=[...document.querySelectorAll(".section")].filter(s=>s.style.display!=="none");
  let current="";
  for(const section of visibleSections){
    if(window.scrollY>=section.offsetTop-100) current=section.id;
  }
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.remove("active"));
  const active=document.querySelector(`.nav-item[href="#${current}"]`);
  if(active)active.classList.add("active");
}

async function init(){
  try{
    const response=await fetch("data.json",{cache:"no-cache"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    sections=await response.json();

    allLinks=[];linkMap.clear();
    sections.forEach(section=>{
      const links=[];
      if(Array.isArray(section.links))links.push(...section.links);
      if(Array.isArray(section.list))section.list.forEach(group=>links.push(...(group.links||[])));
      links.forEach(link=>{allLinks.push(link);linkMap.set(linkKey(link),link);});
    });

    renderContent();
    renderQuickSections();
    applySearch("");

    searchInput.addEventListener("input",()=>applySearch(searchInput.value));

    document.addEventListener("keydown",event=>{
      const active=document.activeElement;
      const typing=active&&(["INPUT","TEXTAREA"].includes(active.tagName)||active.isContentEditable);
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
        event.preventDefault();searchInput.focus();searchInput.select();return;
      }
      if(event.key==="/"&&!typing){event.preventDefault();searchInput.focus();return;}
      if(event.key==="Escape"&&active===searchInput){searchInput.value="";applySearch("");searchInput.blur();}
    });

    document.addEventListener("click",event=>{
      const favoriteButton=event.target.closest(".favorite-btn");
      if(favoriteButton){
        event.preventDefault();event.stopPropagation();
        const card=favoriteButton.closest(".card");
        const link=linkMap.get(decodeURIComponent(card?.dataset.key||""));
        if(link)toggleFavorite(link);
        return;
      }

      const card=event.target.closest(".card");
      if(!card)return;
      const link=linkMap.get(decodeURIComponent(card.dataset.key||""));
      if(!link)return;

      if(card.dataset.copyEnabled==="true"){
        navigator.clipboard.writeText(link.copy_content||"").then(()=>{
          const toast=document.getElementById("js-toast");
          toast.classList.add("show");
          clearTimeout(window.__toastTimer);
          window.__toastTimer=setTimeout(()=>toast.classList.remove("show"),4000);
        });
      }else if(link.url&&link.url!=="javascript:void(0);"){
        addRecent(link);
        window.open(link.url,"_blank","noopener,noreferrer");
      }
    });

    window.addEventListener("scroll",setActiveNav,{passive:true});
  }catch(error){
    console.error("data.json 載入失敗:",error);
    mainContent.innerHTML='<div class="empty-state">無法載入網站資料，請重新整理頁面。</div>';
  }
}

init();
