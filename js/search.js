function initSearch(){
  search?.addEventListener('input',()=>{
    const q=search.value.trim().toLowerCase();
    search.closest('.search-box')?.classList.toggle('has-value',Boolean(q));
    if(!q){result.textContent='';home();return}
    const terms=q.split(/\s+/).filter(Boolean);
    const a=all.filter(l=>{const haystack=[l.title,l.description||'',l._taxonomy||'',l._term||'',...(Array.isArray(l.keywords)?l.keywords:[])].join(' ').toLowerCase();return terms.every(term=>haystack.includes(term))});
    result.textContent=`找到 ${a.length} 個結果`;
    main.innerHTML=quick('搜尋結果','fa-solid fa-magnifying-glass',a,'search');
    const meta=main.querySelector('.search-result-meta');if(meta)meta.innerHTML=`搜尋「<strong>${esc(search.value.trim())}</strong>」 · ${a.length} 個結果`;
    sidebar();
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();search?.focus();
    }
    if(e.key==='Escape'&&document.activeElement===search){
      search.value='';
      result.textContent='';
      search.closest('.search-box')?.classList.remove('has-value');
      home();
    }
  });
}
