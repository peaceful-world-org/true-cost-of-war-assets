(()=>{
  const current=document.currentScript;
  const lang=current?.dataset?.lang||'en';
  if(!['en','ru'].includes(lang)) throw new Error('Current-product RC supports EN/RU only');

  const overviewSrc='https://peaceful-world-org.github.io/true-cost-of-war/unified/product.html?lang=en&embed=1';
  const detailsSrc='https://peaceful-world-org.github.io/true-cost-of-war/model-v2-lab/index.html?lang=en&embed=1';

  const iframe=document.createElement('iframe');
  iframe.id='pw-tcow-current-product-rc';
  iframe.dataset.pwTcowRc=lang;
  iframe.dataset.pwSourceCommit='8b4f8e207cdef84a3958953fb37954a7c3816283';
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

  const chromeStyle=document.createElement('style');
  chromeStyle.id='pw-tcow-parent-view-switch-style';
  chromeStyle.textContent=`
    #pw-tcow-parent-view-switch{
      position:fixed;top:50%;right:-48px;z-index:999999;
      display:flex;align-items:center;gap:2px;padding:3px;
      border:1px solid rgba(201,196,184,.86);border-radius:999px;
      background:rgba(255,254,251,.94);box-shadow:0 6px 20px rgba(24,26,23,.09);
      backdrop-filter:blur(12px);opacity:0;pointer-events:none;
      transform:translateY(-50%) rotate(90deg) scale(.97);
      transform-origin:center;transition:opacity .16s ease,transform .16s ease,box-shadow .16s ease;
    }
    #pw-tcow-parent-view-switch.is-visible{
      opacity:1;pointer-events:auto;transform:translateY(-50%) rotate(90deg) scale(1);
    }
    #pw-tcow-parent-view-switch button{
      min-width:72px;min-height:30px;padding:6px 10px;border:0;border-radius:999px;
      background:transparent;color:#505149;font:750 11px/1.2 Inter,system-ui,sans-serif;
      cursor:pointer;white-space:nowrap;
    }
    #pw-tcow-parent-view-switch button[aria-pressed="true"]{background:#1f231f;color:#fff}
    #pw-tcow-parent-view-switch button:hover{background:#eeece5;color:#181a17}
    #pw-tcow-parent-view-switch button[aria-pressed="true"]:hover{background:#1f231f;color:#fff}
    @media(max-width:980px){
      #pw-tcow-parent-view-switch{top:auto;right:auto;left:50%;
        bottom:calc(12px + env(safe-area-inset-bottom,0px));
        max-width:calc(100vw - 20px);
        transform:translate(-50%,10px) scale(.98)}
      #pw-tcow-parent-view-switch.is-visible{transform:translate(-50%,0) scale(1)}
      #pw-tcow-parent-view-switch button{min-width:82px;font-size:11px}
    }
    #pw-tcow-parent-session-counter{
      position:fixed;top:96px;right:22px;z-index:999998;
      display:flex;min-width:184px;flex-direction:column;gap:3px;
      padding:10px 13px;border:1px solid rgba(201,196,184,.86);border-radius:15px;
      background:rgba(255,254,251,.95);box-shadow:0 7px 22px rgba(24,26,23,.09);
      backdrop-filter:blur(12px);color:#181a17;
      opacity:0;pointer-events:none;transform:translateY(-8px) scale(.98);
      transition:opacity .16s ease,transform .16s ease;
    }
    #pw-tcow-parent-session-counter.is-visible{
      opacity:1;transform:translateY(0) scale(1);
    }
    #pw-tcow-parent-session-counter .pw-live-label{
      display:flex;align-items:center;gap:6px;color:#5f625b;
      font:800 9.5px/1.2 Inter,system-ui,sans-serif;letter-spacing:.055em;text-transform:uppercase;
      white-space:nowrap;
    }
    #pw-tcow-parent-session-counter .pw-live-dot{
      width:7px;height:7px;flex:0 0 7px;border-radius:50%;background:#b5483d;
      box-shadow:0 0 0 3px rgba(181,72,61,.10);
    }
    #pw-tcow-parent-session-counter .pw-live-value{
      color:#181a17;font:850 20px/1.15 Inter,system-ui,sans-serif;
      font-variant-numeric:tabular-nums;letter-spacing:-.02em;white-space:nowrap;
    }
    @media(max-width:980px){
      #pw-tcow-parent-session-counter{
        top:auto;right:auto;left:50%;
        bottom:calc(62px + env(safe-area-inset-bottom,0px));
        min-width:0;max-width:calc(100vw - 24px);padding:8px 12px;border-radius:13px;
        transform:translate(-50%,8px) scale(.98);
      }
      #pw-tcow-parent-session-counter.is-visible{transform:translate(-50%,0) scale(1)}
      #pw-tcow-parent-session-counter .pw-live-label{font-size:9px}
      #pw-tcow-parent-session-counter .pw-live-value{font-size:18px}
    }
    @media(prefers-reduced-motion:reduce){
      #pw-tcow-parent-view-switch,#pw-tcow-parent-session-counter{transition:none}
    }
  `;
  document.head.appendChild(chromeStyle);

  const sessionCounter=document.createElement('aside');
  sessionCounter.id='pw-tcow-parent-session-counter';
  sessionCounter.dataset.pwSessionCounter='true';
  sessionCounter.setAttribute('aria-label',lang==='ru'?'Расходы за время просмотра':'Spending while you view');
  sessionCounter.innerHTML=`
    <div class="pw-live-label"><span class="pw-live-dot" aria-hidden="true"></span><span>${lang==='ru'?'ПОКА ВЫ СМОТРИТЕ':'WHILE YOU VIEW'}</span></div>
    <div class="pw-live-value" data-live-value>$ 0</div>
  `;

  const annualSpend=2887000000000;
  const secondsPerYear=365.25*24*60*60;
  const spendPerSecond=annualSpend/secondsPerYear;
  let activeAccumulatedMs=0;
  let activeSince=document.hidden?null:performance.now();

  function activeElapsedMs(now=performance.now()){
    if(activeSince===null) return activeAccumulatedMs;
    return activeAccumulatedMs+Math.max(0,now-activeSince);
  }

  function setViewingActive(active,now=performance.now()){
    if(active){
      if(activeSince===null) activeSince=now;
    }else if(activeSince!==null){
      activeAccumulatedMs+=Math.max(0,now-activeSince);
      activeSince=null;
    }
  }

  document.addEventListener('visibilitychange',()=>{
    setViewingActive(!document.hidden);
    updateSessionCounter();
  });

  function formatSessionSpend(value){
    const abs=Math.max(0,Number(value)||0);
    const locale=lang==='ru'?'ru-RU':'en-US';
    const specs=lang==='ru'
      ? [[1e12,'трлн'],[1e9,'млрд'],[1e6,'млн'],[1e3,'тыс.']]
      : [[1e12,'tn'],[1e9,'bn'],[1e6,'m'],[1e3,'k']];
    for(const [scale,suffix] of specs){
      if(abs>=scale){
        const scaled=abs/scale;
        const digits=scaled<10?2:scaled<100?1:0;
        return '$ '+new Intl.NumberFormat(locale,{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(scaled)+' '+suffix;
      }
    }
    return '$ '+new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(abs);
  }

  function updateSessionCounter(){
    const value=spendPerSecond*(activeElapsedMs()/1000);
    sessionCounter.querySelector('[data-live-value]').textContent=formatSessionSpend(value);
    sessionCounter.dataset.pwLiveValue=String(Math.floor(value));
  }

  setInterval(updateSessionCounter,250);
  updateSessionCounter();

  const viewSwitch=document.createElement('nav');
  viewSwitch.id='pw-tcow-parent-view-switch';
  viewSwitch.dataset.pwViewSwitch='true';
  viewSwitch.setAttribute('aria-label',lang==='ru'?'Режим просмотра':'View mode');

  function makeViewButton(view,label){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.view=view;
    button.textContent=label;
    button.addEventListener('click',()=>{
      setActiveView(view);
      iframe.src=view==='details'?detailsSrc:overviewSrc;
    });
    viewSwitch.appendChild(button);
    return button;
  }

  const overviewButton=makeViewButton('overview',lang==='ru'?'Обзор':'Overview');
  const detailsButton=makeViewButton('details',lang==='ru'?'Подробнее':'Details');

  function setActiveView(view){
    const normalized=view==='details'?'details':'overview';
    viewSwitch.dataset.pwActiveView=normalized;
    overviewButton.setAttribute('aria-pressed',String(normalized==='overview'));
    detailsButton.setAttribute('aria-pressed',String(normalized==='details'));
  }
  setActiveView('overview');

  function syncFloatingVisibility(){
    const rect=iframe.getBoundingClientRect();
    const activeView=viewSwitch.dataset.pwActiveView||'overview';
    const overlapsViewport=rect.bottom > 120 && rect.top < (window.innerHeight-80);

    const viewSwitchVisible=rect.top < -110 && overlapsViewport;
    viewSwitch.classList.toggle('is-visible',viewSwitchVisible);
    viewSwitch.dataset.pwFloatingVisible=String(viewSwitchVisible);

    const counterThreshold=activeView==='details'?-240:-820;
    const counterVisible=rect.top < counterThreshold && overlapsViewport;
    sessionCounter.classList.toggle('is-visible',counterVisible);
    sessionCounter.dataset.pwLiveVisible=String(counterVisible);
  }

  window.addEventListener('scroll',syncFloatingVisibility,{passive:true});
  window.addEventListener('resize',syncFloatingVisibility,{passive:true});

  function onMessage(event){
    if(event.origin!=='https://peaceful-world-org.github.io') return;
    iframe.dataset.pwMessageOrigin='matched';
    iframe.dataset.pwMessageType=String(event.data?.type||'unknown');
    if(event.source!==iframe.contentWindow){
      iframe.dataset.pwMessageSource='mismatch';
      return;
    }
    iframe.dataset.pwMessageSource='matched';
    if(event.data?.type==='pw2-view'){
      setActiveView(event.data.view);
      return;
    }
    if(event.data?.type!=='pw2-resize') return;
    const height=Number(event.data.height);
    if(!Number.isFinite(height)||height<100){
      iframe.dataset.pwResizeStatus='invalid-height';
      return;
    }
    iframe.style.height=Math.ceil(height)+'px';
    iframe.dataset.pwResize=String(Math.ceil(height));
    iframe.dataset.pwResizeStatus='received';
    syncFloatingVisibility();
  }
  window.addEventListener('message',onMessage);

  function requestState(){
    try{
      iframe.contentWindow?.postMessage({type:'pw2-request-resize'},'https://peaceful-world-org.github.io');
      iframe.contentWindow?.postMessage({type:'pw2-request-view'},'https://peaceful-world-org.github.io');
    }catch(_){}
  }

  iframe.addEventListener('load',()=>{
    iframe.dataset.pwLoad='true';
    requestState();
    setTimeout(requestState,150);
    setTimeout(requestState,600);
    setTimeout(syncFloatingVisibility,0);
  });

  iframe.src=overviewSrc;

  const anchor=current||document.body.lastChild;
  if(anchor?.parentNode) anchor.parentNode.insertBefore(iframe,anchor);
  else document.body.appendChild(iframe);
  document.body.appendChild(viewSwitch);
  document.body.appendChild(sessionCounter);

  syncFloatingVisibility();
  setTimeout(requestState,1200);
  setTimeout(requestState,3000);
  setTimeout(syncFloatingVisibility,300);
})();

