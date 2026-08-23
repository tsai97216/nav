function initSearch(){
  search?.addEventListener('input',()=>{
    const q=search.value.trim().toLowerCase();
    if(!q){result.textContent='';home();return}
    const a=all.filter(l=>`${l.title} ${l.description||''}`.toLowerCase().includes(q));
    result.textContent=`找到 ${a.length} 個結果`;
    main.innerHTML=quick('搜尋結果','fa-solid fa-magnifying-glass',a,'search');
    sidebar();
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();search?.focus();
    }
    if(e.key==='Escape'&&document.activeElement===search){
      search.value='';
      result.textContent='';
      home();
    }
  });
}