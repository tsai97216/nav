(()=>{
  const REPO='tsai97216/nav',DATA_PATH='data/data.json';
  const form=document.getElementById('quick-add');
  if(!form)return;
  const taxonomy=form.taxonomy,subcategory=form.subcategory,status=document.getElementById('status');
  let data=[];
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function parseData(text){const parsed=typeof text==='string'?JSON.parse(text):text;if(Array.isArray(parsed))return parsed;if(typeof parsed?.content==='string')return JSON.parse(parsed.content);throw new Error('data.json 格式不是有效的 NAV 資料陣列')}
  function refreshSubcategory(){
    const section=data.find(x=>x.taxonomy===taxonomy.value);
    const items=Array.isArray(section?.list)?section.list.map(x=>x.term).filter(Boolean):[];
    if(items.length){subcategory.innerHTML=items.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');subcategory.disabled=false;subcategory.required=true;}
    else if(Array.isArray(section?.links)){subcategory.innerHTML='<option value="">此分類沒有子分類</option>';subcategory.disabled=true;subcategory.required=false;}
    else{subcategory.innerHTML='<option value="">沒有子分類</option>';subcategory.disabled=true;subcategory.required=false;}
  }
  function refreshTaxonomy(){taxonomy.innerHTML=data.length?data.map(x=>`<option value="${escapeHtml(x.taxonomy)}">${escapeHtml(x.taxonomy)}</option>`).join(''):'<option value="">沒有分類</option>';taxonomy.disabled=!data.length;refreshSubcategory()}
  async function loadData(){
    status.textContent='正在讀取分類…';
    try{const r=await fetch(`https://raw.githubusercontent.com/${REPO}/main/${DATA_PATH}?v=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`資料載入失敗（HTTP ${r.status}）`);data=parseData(await r.text());refreshTaxonomy();status.textContent=`已載入 ${data.length} 個分類`}
    catch(e){console.error(e);status.textContent=`✗ ${e.message}`;taxonomy.innerHTML='<option value="">無法載入分類</option>';subcategory.innerHTML='<option value="">無法載入子分類</option>';taxonomy.disabled=true;subcategory.disabled=true}
  }
  async function github(path,options={}){throw new Error('GitHub 寫入功能尚未啟用，請先完成 Admin 認證')}
  taxonomy.addEventListener('change',refreshSubcategory);
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form),title=String(fd.get('title')||'').trim(),url=String(fd.get('url')||'').trim(),description=String(fd.get('description')||'').trim(),icon=String(fd.get('icon')||'fa-solid fa-globe').trim(),tax=String(fd.get('taxonomy')||''),sub=String(fd.get('subcategory')||'');
    if(!title||!url||!tax){status.textContent='✗ 請完整填寫網站名稱、網址與分類';return}
    const section=data.find(x=>x.taxonomy===tax),hasSubcats=Array.isArray(section?.list)&&section.list.length>0;
    if(hasSubcats&&!sub){status.textContent='✗ 此分類需要選擇子分類';return}
    try{new URL(url)}catch{status.textContent='✗ 網址格式不正確';return}
    try{
      const target=hasSubcats?section.list.find(x=>x.term===sub):section;
      if(!target||!Array.isArray(target.links))throw new Error('找不到指定的網站列表');
      if(target.links.some(x=>x.url===url||x.title===title))throw new Error('同名稱或同網址已存在');
      target.links.push({title,url,description,icon});
      status.textContent='✓ 已加入目前 Admin 預覽資料。GitHub 提交功能將在 Admin 認證完成後啟用。';
      form.reset();document.getElementById('icon').value='fa-solid fa-globe';refreshTaxonomy();
    }catch(e){console.error(e);status.textContent=`✗ ${e.message||'新增失敗'}`}
  });
  loadData();
})();
