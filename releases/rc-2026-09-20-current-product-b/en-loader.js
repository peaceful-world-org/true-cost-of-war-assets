(()=>{
  const current=document.currentScript;
  const lang=current?.dataset?.lang||'en';
  if(!['en','ru'].includes(lang)) throw new Error('Current-product RC supports EN/RU only');

  const iframe=document.createElement('iframe');
  iframe.id='pw-tcow-current-product-rc';
  iframe.dataset.pwTcowRc=lang;
  iframe.dataset.pwSourceCommit='c711ef8b36d0d121efd45f73c7591306917ec34f';
  iframe.title=lang==='ru'?'Истинная цена войны — релиз-кандидат':'The True Cost of War — release candidate';
  iframe.loading='eager';
  iframe.scrolling='no';
  Object.assign(iframe.style,{
    width:'100%',
    border:'0',
    borderRadius:'0',
    overflow:'hidden',
    minHeight:'500px',
    background:'transparent',
    display:'block'
  });

  function onMessage(event){
    if(event.origin!=='https://peaceful-world-org.github.io') return;
    if(event.source!==iframe.contentWindow) return;
    if(event.data?.type!=='pw2-resize') return;
    const height=Number(event.data.height);
    if(!Number.isFinite(height)||height<100) return;
    iframe.style.height=Math.ceil(height)+'px';
    iframe.dataset.pwResize=String(Math.ceil(height));
    iframe.dataset.pwResizeStatus='received';
  }
  window.addEventListener('message',onMessage);

  function requestResize(){
    try{
      iframe.contentWindow?.postMessage({type:'pw2-request-resize'},'https://peaceful-world-org.github.io');
    }catch(_){}
  }

  iframe.addEventListener('load',()=>{
    iframe.dataset.pwLoad='true';
    requestResize();
    setTimeout(requestResize,150);
    setTimeout(requestResize,600);
  });

  iframe.src='https://peaceful-world-org.github.io/true-cost-of-war/unified/product.html?lang=en&embed=1';

  const anchor=current||document.body.lastChild;
  if(anchor?.parentNode) anchor.parentNode.insertBefore(iframe,anchor);
  else document.body.appendChild(iframe);

  setTimeout(requestResize,1200);
  setTimeout(requestResize,3000);
})();

