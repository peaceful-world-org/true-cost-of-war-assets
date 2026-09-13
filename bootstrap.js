(()=>{
  const current=document.currentScript;
  const lang=current?.dataset?.lang||'en';
  const allowed=new Set(['en','ru','ukr','es','ar','hi','fr','pt','fa','de','zh-CN']);
  if(!allowed.has(lang)) throw new Error(`Unsupported True Cost of War language: ${lang}`);

  const release='prod-2026-09-13-a';
  const fallback=`https://cdn.jsdelivr.net/gh/peaceful-world-org/true-cost-of-war-assets@${release}/releases/${release}/${lang}-loader.js`;
  const manifestUrl=`https://raw.githubusercontent.com/peaceful-world-org/true-cost-of-war-assets/main/release.json?ts=${Date.now()}`;

  (async()=>{
    let src=fallback;
    try{
      const response=await fetch(manifestUrl,{cache:'no-store'});
      if(!response.ok) throw new Error(`release manifest HTTP ${response.status}`);
      const manifest=await response.json();
      if(manifest?.loaders?.[lang]) src=manifest.loaders[lang];
    }catch(error){
      console.warn('[True Cost of War] release manifest unavailable; using approved public fallback loader.',error);
    }

    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.dataset.pwTcowAssetBootstrap=lang;
    if(current&&current.parentNode) current.parentNode.insertBefore(script,current.nextSibling);
    else document.head.appendChild(script);
  })();
})();
