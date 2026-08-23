const FAV='chi-nav-favorites',REC='chi-nav-recent',LIMIT=8;

function loadStore(key){return load(key)}
function saveFavorites(items){save(FAV,items)}
function saveRecent(items){save(REC,items.slice(0,LIMIT))}
function normalizeFavorites(items,map){return new Set([...items].map(norm).filter(k=>map.has(k)))}
function normalizeRecent(items,map){return [...new Set(items.map(norm).filter(k=>map.has(k)))].slice(0,LIMIT)}
function toggleFavorite(item,favorites){const k=key(item);if(favorites.has(k))favorites.delete(k);else favorites.add(k);saveFavorites([...favorites]);return favorites}
function addRecent(item,recent){const k=key(item);const next=[k,...recent.filter(x=>x!==k)].slice(0,LIMIT);saveRecent(next);return next}
function getStoredFavorites(){return new Set(loadStore(FAV))}
function getStoredRecent(){return loadStore(REC)}
