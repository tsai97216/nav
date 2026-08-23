function initSearch(){
  let activeIndex=-1;
  const updateSearchActive=()=>{
    const cards=[...main.querySelectorAll('#search .card')];
    cards.forEach((card,i)=>card.classList.toggle('search-active',i===activeIndex));
    if(activeIndex>=0&&cards[activeIndex])cards[activeIndex].scrollIntoView({block:'nearest',behavior:'smooth'});
  };
  const renderResults=query=>{
    const terms=query.split(/\s+/).filter(Boolean);
    const a=all.filter(l=>{const haystack=[l.title,l.description||'',l._taxonomy||'',l._term||'',...(Array.isArray(l.keywords)?l.keywords:[])].join(' ').toLowerCase();return terms.every(term=>haystack.includes(term))});
    result.textContent=`找到 ${a.length} 個結果`;
    main.innerHTML=quick('搜尋結果','fa-solid fa-magnifying-glass',a,'search');
    const meta=main.querySelector('.search-result-meta');if(meta)meta.innerHTML=`搜尋「<strong>${esc(search.value.trim())}</strong>」 · ${a.length} 個結果`;
    sidebar();
    activeIndex=-1;
    updateSearchActive();
  };
  search?.addEventListener('input',()=>{
    const q=search.value.trim().toLowerCase();
    search.closest('.search-box')?.classList.toggle('has-value',Boolean(q));
    if(!q){result.textContent='';activeIndex=-1;home();return}
    renderResults(q);
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();search?.focus();search?.select();return;
    }
    if(document.activeElement===search&&e.key==='ArrowDown'){
      const cards=main.querySelectorAll('#search .card');if(!cards.length)return;e.preventDefault();activeIndex=Math.min(activeIndex+1,cards.length-1);updateSearchActive();return;
    }
    if(document.activeElement===search&&e.key==='ArrowUp'){
      const cards=main.querySelectorAll('#search .card');if(!cards.length)return;e.preventDefault();activeIndex=Math.max(activeIndex-1,0);updateSearchActive();return;
    }
    if(document.activeElement===search&&e.key==='Enter'){
      const card=main.querySelectorAll('#search .card')[activeIndex];const link=card?.querySelector('.card-link');if(link){e.preventDefault();link.click();return;}
    }
    if(e.key==='Escape'&&document.activeElement===search){
      search.value='';result.textContent='';activeIndex=-1;search.closest('.search-box')?.classList.remove('has-value');home();
    }
  });
}
