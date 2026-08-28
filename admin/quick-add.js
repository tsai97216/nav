(()=>{
  const REPO='tsai97216/nav', DATA_PATH='data/data.json';
  const form=document.getElementById('quick-add');
  if(!form)return;
  const taxonomy=form.taxonomy, subcategory=form.subcategory, status=document.getElementById('status'), tokenInput=form.token;
  let data=[];
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function parseData(encoded){
    const bin=atob(String(encoded).replace(/\n/g,''));
    const text=new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)));
    const parsed=JSON.parse(text);
    if(Array.isArray(parsed))return parsed;
    if(typeof parsed?.content==='string'){
      const inner=JSON.parse(parsed.content);
      if(Array.isArray(inner))return inner;
    }
    throw new Error('data.json 格式不是有效的 NAV 資料陣列');
  }
  function refreshSubcategory(){
    const s=data.find(x=>x.taxonomy===taxonomy.value);
    const items=Array.isArray(s?.list)?s.list.map(x=>x.term).filter(Boolean):[];
    subcategory.innerHTML=items.length?items.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join(''):'<option value="">沒有子分類</option>';
    subcategory.disabled=!items.length;
  }
  function refreshTaxonomy(){
    taxonomy.innerHTML=data.map(s=>`<option value="${escapeHtml(s.taxonomy)}">${escapeHtml(s.taxonomy)}</option>`).join('');
    taxonomy.disabled=!data.length;
    refreshSubcategory();
  }
  function decode(encoded){return parseData(encoded)}
  function encode(text){const bytes=new TextEncoder().encode(text);let bin='';for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin)}
  async function github(path,options={}){
    const token=tokenInput.value.trim();
    if(!token)throw new Error('請輸入 GitHub Token');
    const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`,{...options,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(options.headers||{})}});
    if(!r.ok){let msg=`GitHub API ${r.status}`;try{const j=await r.json();if(j.message)msg+=`: ${j.message}`}catch{}throw new Error(msg)}
    return r.json();
  }
  async function load(){
    status.textContent='正在讀取資料…';
    try{
      const current=await github(DATA_PATH);
      data=parseData(current.content);
      refreshTaxonomy();
      status.textContent=`已載入 ${data.length} 個分類`;
    }catch(e){
      status.textContent=`✗ ${e.message}`;
      taxonomy.innerHTML='<option value="">無法載入分類</option>';
      subcategory.innerHTML='<option value="">無法載入子分類</option>';
      taxonomy.disabled=true;subcategory.disabled=true;
    }
  }
  taxonomy.addEventListener('change',refreshSubcategory);
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form),title=String(fd.get('title')||'').trim(),url=String(fd.get('url')||'').trim(),description=String(fd.get('description')||'').trim(),icon=String(fd.get('icon')||'fa-solid fa-globe').trim(),tax=String(fd.get('taxonomy')||''),sub=String(fd.get('subcategory')||'');
    if(!title||!url||!tax||!sub)return;
    try{new URL(url)}catch{status.textContent='✗ 網址格式不正確';return}
    try{
      status.textContent='正在讀取最新資料…';
      const current=await github(DATA_PATH);
      const remoteData=parseData(current.content);
      const section=remoteData.find(x=>x.taxonomy===tax);
      if(!section)throw new Error('找不到指定分類');
      const group=Array.isArray(section.list)?section.list.find(x=>x.term===sub):null;
      if(!group||!Array.isArray(group.links))throw new Error('找不到指定子分類');
      if(group.links.some(x=>x.url===url||x.title===title))throw new Error('同名稱或同網址已存在');
      group.links.push({title,url,description,icon});
      status.textContent='正在提交 GitHub…';
      await github(DATA_PATH,{method:'PUT',body:JSON.stringify({message:`feat: quick add ${title}`,content:encode(JSON.stringify({content:JSON.stringify(remoteData) },null,2)+'\n'),sha:current.sha,branch:'main'})});
      status.textContent='✓ 新增成功，等待 GitHub Pages 部署。';
      form.reset();document.getElementById('icon').value='fa-solid fa-globe';
    }catch(e){console.error(e);status.textContent=`✗ ${e.message||'新增失敗'}`}
  });
  load();
})();
