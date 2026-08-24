const navMenu=document.getElementById('js-nav-menu'),main=document.getElementById('js-main-content'),search=document.getElementById('search-input'),result=document.getElementById('search-result-info'),toast=document.getElementById('js-toast');
const VERSION='v2.8.7',THEME='chi-nav-theme';
let data=[],all=[],map=new Map(),favorites=getStoredFavorites(),recent=getStoredRecent(),active={};
