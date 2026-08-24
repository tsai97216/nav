function load(k){try{const x=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function save(k,x){try{localStorage.setItem(k,JSON.stringify(x))}catch{}}
const TRACKING_PARAMS=/^(utm_[a-z0-9_]+|fbclid|gclid|dclid|msclkid|_gl|mc_cid|mc_eid)$/i;
function norm(u){try{const x=new URL(u,location.href);x.hash='';x.hostname=x.hostname.toLowerCase();x.pathname=x.pathname.replace(/\/{2,}/g,'/').replace(/\/$/,'')||'/';for(const key of [...x.searchParams.keys()])if(TRACKING_PARAMS.test(key))x.searchParams.delete(key);const params=[...x.searchParams.entries()].sort(([a],[b])=>a.localeCompare(b));x.search='';for(const [key,value] of params)x.searchParams.append(key,value);return x.toString()}catch{return String(u||'')}}
function key(l){return norm(l.url)}
function esc(v=''){return String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
function src(n){return data.find(x=>x.taxonomy===n)}
function flat(s){return s?(s.links?[...s.links]:(s.list||[]).flatMap(x=>x.links||[])):[]}
function uniq(a){const seen=new Set();return a.filter(l=>{const k=key(l);if(seen.has(k))return false;seen.add(k);return true})}
function tabData(g,t){const [label,source,term]=t,s=src(source);return uniq(s?.list?.find(group=>group.term===term)?.links||[])}
