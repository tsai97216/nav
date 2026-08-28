(()=>{
  const REPO='tsai97216/nav',DATA_PATH='data/data.json';
  const form=document.getElementById('quick-add');
  if(!form)return;
  const taxonomy=form.taxonomy,subcategory=form.subcategory,status=document.getElementById('status'),tokenInput=form.token;
  let data=[];
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function parseData(text){
    const parsed=typeof text==='string'?JSON.parse(text):text;
    if(Array.isArray(parsed))return parsed;
    if(typeof parsed?.content==='string')return JSON.parse(parsed.content);
    throw new Error('data.json 格式不是有效的 NAV 資料陣列');
  }
  function decodeBase64(encoded){
    const bin=atob(String(encoded).replace(/\n/g,''));
    return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)));
  }
  function encode(text){const bytes=new TextEncoder().encode(text);let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin)}
  function refreshSubcategory(){
    const section=data.find(x=>x.taxonomy===taxonomy.value);
    const items=Array.isArray(section?.list)?section.list.map(x=>x.term).filter(Boolean):[];
    subcategory.innerHTML=items.length?items.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join(''):'<option value="">沒有子分類</option>';
    subcategory.disabled=!items.length;
  }
  function refreshTaxonomy(){
    taxonomy.innerHTML=data.length?data.map(x=>`<option value="${escapeHtml(x.taxonomy)}">${escapeHtml(x.taxonomy)}</option>`).join(''):'<option value="">沒有分類</option>';
    taxonomy.disabled=!data.length;
    refreshSubcategory();
  }
  async function loadData(){
    status.textContent='正在讀取分類…';
    try{
      const r=await fetch(`https://raw.githubusercontent.com/${REPO}/main/${DATA_PATH}?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok)throw new Error(`資料載入失敗（HTTP ${r.status}）`);
      data=parseData(await r.text());
      refreshTaxonomy();
      status.textContent=`已載入 ${data.length} 個分類`;
    }catch(e){
      console.error(e);status.textContent=`✗ ${e.message}`;
      taxonomy.innerHTML='<option value="">無法載入分類</option>';
      subcategory.innerHTML='<option value="">無法載入子分類</option>';
      taxonomy.disabled=true;subcategory.disabled=true;
    }
  }
  async function github(path,options={}){
    const token=tokenInput.value.trim();
    if(!token)throw new Error('提交前請輸入 GitHub Token');
    const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`,{...options,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(options.headers||{})}});
    if(!r.ok){let msg=`GitHub API ${r.status}`;try{const j=await r.json();if(j.message)msg+=`: ${j.message}`}catch{}throw new Error(msg)}
    return r.json();
  }
  taxonomy.addEventListener('change',refreshSubcategory);
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form),title=String(fd.get('title')||'').trim(),url=String(fd.get('url')||'').trim(),description=String(fd.get('description')||'').trim(),icon=String(fd.get('icon')||'fa-solid fa-globe').trim(),tax=String(fd.get('taxonomy')||''),sub=String(fd.get('subcategory')||'');
    if(!title||!url||!tax||!sub){status.textContent='✗ 請完整填寫網站名稱、網址、分類與子分類';return}
    try{new URL(url)}catch{status.textContent='✗ 網址格式不正確';return}
    try{
      status.textContent='正在讀取最新資料…';
      const current=await github(DATA_PATH),remoteData=parseData(decodeBase64(current.content));
      const section=remoteData.find(x=>x.taxonomy===tax),group=section?.list?.find(x=>x.term===sub);
      if(!section)throw new Error('找不到指定分類');
      if(!group||!Array.isArray(group.links))throw new Error('找不到指定子分類');
      if(group.links.some(x=>x.url===url||x.title===title))throw new Error('同名稱或同網址已存在');
      group.links.push({title,url,description,icon});
      status.textContent='正在提交 GitHub…';
      await github(DATA_PATH,{method:'PUT',body:JSON.stringify({message:`feat: quick add ${title}`,content:encode(JSON.stringify({content:JSON.stringify(remoteData,null,2)},null,2)+'\n'),sha:current.sha,branch:'main'})});
      status.textContent='✓ 新增成功，等待 GitHub Pages 部署。';
      form.reset();document.getElementById('icon').value='fa-solid fa-globe';
      await loadData();
    }catch(e){console.error(e);status.textContent=`✗ ${e.message||'新增失敗'}`}
  });
  loadData();
})();
