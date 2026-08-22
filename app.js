const navMenu = document.getElementById("js-nav-menu");
const mainContent = document.getElementById("js-main-content");

const fallbackColors = [
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#10b981,#047857)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#14b8a6,#0f766e)",
  "linear-gradient(135deg,#ef4444,#b91c1c)"
];

function stringToColorIndex(str){
  let hash = 0;
  for(let i=0;i<str.length;i++){
    hash = str.charCodeAt(i) + ((hash<<5)-hash);
  }
  return Math.abs(hash)%fallbackColors.length;
}

function createCard(link){
  let domain="";
  try{
    if(link.url.startsWith("http")) domain = new URL(link.url).hostname;
  }catch(e){}

  const color = fallbackColors[stringToColorIndex(link.title)];
  const letter = link.title.charAt(0);

  const copyBadge = link.is_copy
    ? `<span class="copy-badge"><i class="fa-regular fa-copy"></i> 腳本</span>`
    : "";

  const copyData = link.is_copy
    ? `data-copy="${encodeURIComponent(link.copy_content)}"`
    : "";

  const favicon = domain
    ? `<img class="card-logo" src="https://www.google.com/s2/favicons?sz=128&domain=${domain}" onerror="this.onerror=null;this.src='https://icon.horse/icon/${domain}' >`
    : "";

  return `
    <div class="card" data-url="${link.url}" data-copy-enabled="${link.is_copy||false}" data-search="${(link.title+" "+(link.description||"")).toLowerCase()}" ${copyData}>
      ${copyBadge}
      <div class="card-top">
        <div class="card-logo-container" style="background:${color}">
          ${favicon}
          <div class="avatar-fallback" style="${domain?'display:none':''}">${letter}</div>
        </div>
        <div class="card-title">${link.title}</div>
      </div>
      <div class="card-desc">${link.description||""}</div>
    </div>
  `;
}

function updateSearchResults(keyword){
  const normalized = keyword.trim().toLowerCase();
  const sections = document.querySelectorAll(".section");
  let resultCount = 0;

  sections.forEach(section=>{
    let sectionMatches = 0;

    section.querySelectorAll(".term-container").forEach(term=>{
      let termMatches = 0;
      term.querySelectorAll(".card").forEach(card=>{
        const text = card.dataset.search || card.innerText.toLowerCase();
        const matched = !normalized || text.includes(normalized);
        card.style.display = matched ? "flex" : "none";
        if(matched){ termMatches++; resultCount++; }
      });
      term.style.display = termMatches ? "" : "none";
      sectionMatches += termMatches;
    });

    const directGrid = section.querySelector(":scope > .grid");
    if(directGrid){
      directGrid.querySelectorAll(".card").forEach(card=>{
        const text = card.dataset.search || card.innerText.toLowerCase();
        const matched = !normalized || text.includes(normalized);
        card.style.display = matched ? "flex" : "none";
        if(matched){ sectionMatches++; resultCount++; }
      });
    }

    section.style.display = sectionMatches ? "" : "none";
    const navItem = document.querySelector(`.nav-item[href="#${section.id}"]`);
    if(navItem) navItem.style.display = sectionMatches ? "" : "none";
  });

  const searchBox = document.querySelector(".search-box");
  let resultInfo = document.getElementById("search-result-info");
  if(!resultInfo){
    resultInfo = document.createElement("span");
    resultInfo.id = "search-result-info";
    resultInfo.setAttribute("aria-live","polite");
    searchBox.appendChild(resultInfo);
  }

  if(normalized){
    resultInfo.textContent = `找到 ${resultCount} 個結果`;
    resultInfo.style.display = "block";
  }else{
    resultInfo.style.display = "none";
  }
}

fetch("data.json")
.then(res=>res.json())
.then(data=>{
  data.forEach((section,index)=>{
    const id = `section-${index}`;

    const nav = document.createElement("a");
    nav.className = "nav-item" + (index===0?" active":"");
    nav.href = "#"+id;
    nav.innerHTML = `<i class="${section.icon}"></i><span>${section.taxonomy}</span>`;
    navMenu.appendChild(nav);

    const sectionDom = document.createElement("section");
    sectionDom.className="section";
    sectionDom.id=id;

    let html = `<div class="section-header"><i class="${section.icon}"></i><span>${section.taxonomy}</span></div>`;

    if(section.list){
      section.list.forEach(group=>{
        html += `<div class="term-container"><div class="term-title">${group.term}</div><div class="grid">`;
        group.links.forEach(link=>{ html += createCard(link); });
        html += `</div></div>`;
      });
    }else if(section.links){
      html += `<div class="grid">`;
      section.links.forEach(link=>{ html += createCard(link); });
      html += `</div>`;
    }

    sectionDom.innerHTML=html;
    mainContent.appendChild(sectionDom);
  });

  const search = document.getElementById("search-input");
  search.addEventListener("input",()=>updateSearchResults(search.value));

  document.addEventListener("keydown",e=>{
    const tag = document.activeElement?.tagName?.toLowerCase();
    const typing = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;

    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      search.focus();
      search.select();
      return;
    }

    if(e.key === "/" && !typing){
      e.preventDefault();
      search.focus();
      return;
    }

    if(e.key === "Escape" && document.activeElement === search){
      search.value = "";
      updateSearchResults("");
      search.blur();
    }
  });

  mainContent.addEventListener("click",e=>{
    const card = e.target.closest(".card");
    if(!card) return;

    const copy = card.dataset.copyEnabled==="true";
    if(copy){
      const text = decodeURIComponent(card.dataset.copy);
      navigator.clipboard.writeText(text).then(()=>{
        const toast = document.getElementById("js-toast");
        toast.classList.add("show");
        setTimeout(()=>toast.classList.remove("show"),5000);
      });
    }else{
      const url = card.dataset.url;
      if(url && url!=="javascript:void(0);"){
        window.open(url,"_blank","noopener,noreferrer");
      }
    }
  });

  window.addEventListener("scroll",()=>{
    let current="";
    document.querySelectorAll(".section").forEach(section=>{
      if(pageYOffset >= section.offsetTop-60) current = section.id;
    });

    document.querySelectorAll(".nav-item").forEach(item=>{
      item.classList.remove("active");
      if(item.href.endsWith("#"+current)) item.classList.add("active");
    });
  });
})
.catch(err=>console.error("data.json 載入失敗:",err));
