(()=>{
  const PRODUCT_ORIGIN='https://peaceful-world-org.github.io';
  const ANNUAL_SPEND=2887000000000;
  const SECONDS_PER_YEAR=365.25*24*60*60;
  const SPEND_PER_SECOND=ANNUAL_SPEND/SECONDS_PER_YEAR;
  const FRESH_STATE_MS=500;

  let iframe=null;
  let counter=null;
  let valueNode=null;
  let valueObserver=null;
  let latestText='';
  let latestSpend=0;
  let latestElapsedMs=0;
  let lastStateAt=-Infinity;

  function resolveNodes(){
    const nextIframe=document.querySelector('#pw-tcow-current-product-rc, iframe[data-pw-tcow-rc]');
    const nextCounter=document.querySelector('#pw-tcow-parent-session-counter');
    const nextValue=nextCounter?.querySelector('[data-live-value]')||null;

    if(nextIframe) iframe=nextIframe;
    if(nextCounter) counter=nextCounter;

    if(nextValue && nextValue!==valueNode){
      valueObserver?.disconnect();
      valueNode=nextValue;
      valueObserver=new MutationObserver(()=>{
        if(!latestText) return;
        if(performance.now()-lastStateAt>FRESH_STATE_MS) return;
        if(valueNode.textContent!==latestText) {
          valueNode.textContent=latestText;
          if(counter && Number.isFinite(latestSpend)) {
            counter.dataset.pwLiveValue=String(Math.floor(latestSpend));
          }
        }
      });
      valueObserver.observe(valueNode,{childList:true,subtree:true,characterData:true});
    }
  }

  function parentElapsedMs(){
    resolveNodes();
    const raw=Number(counter?.dataset?.pwLiveValue);
    if(Number.isFinite(raw) && raw>=0) return raw/SPEND_PER_SECOND*1000;
    if(Number.isFinite(latestElapsedMs) && latestElapsedMs>=0) return latestElapsedMs;
    return 0;
  }

  function sendSeed(){
    resolveNodes();
    if(!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({
      type:'pw2-session-seed',
      elapsedMs:parentElapsedMs(),
    },PRODUCT_ORIGIN);
  }

  function applyChildState(data){
    resolveNodes();
    const spend=Number(data?.spend);
    const elapsedMs=Number(data?.elapsedMs);
    const text=typeof data?.spendText==='string'?data.spendText:'';
    if(!valueNode || !text || !Number.isFinite(spend) || !Number.isFinite(elapsedMs)) return;

    latestText=text;
    latestSpend=Math.max(0,spend);
    latestElapsedMs=Math.max(0,elapsedMs);
    lastStateAt=performance.now();

    if(valueNode.textContent!==latestText) valueNode.textContent=latestText;
    if(counter){
      counter.dataset.pwLiveValue=String(Math.floor(latestSpend));
      counter.dataset.pwLiveElapsedMs=String(Math.round(latestElapsedMs));
      counter.dataset.pwSessionSync='child';
    }
  }

  function onMessage(event){
    resolveNodes();
    if(event.origin!==PRODUCT_ORIGIN) return;
    if(!iframe?.contentWindow || event.source!==iframe.contentWindow) return;

    if(event.data?.type==='pw2-session-ready'){
      sendSeed();
      return;
    }

    if(event.data?.type==='pw2-session-state'){
      applyChildState(event.data);
    }
  }

  window.addEventListener('message',onMessage);

  const domObserver=new MutationObserver(()=>{
    resolveNodes();
  });
  domObserver.observe(document.documentElement,{childList:true,subtree:true});

  resolveNodes();
  setTimeout(sendSeed,250);
  setTimeout(sendSeed,900);
  setTimeout(sendSeed,2200);

  document.documentElement.dataset.pwTcowSessionSync='ready';
})();