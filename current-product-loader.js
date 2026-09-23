(()=>{
  const current=document.currentScript;
  const lang=current?.dataset?.lang==='ru'?'ru':'en';
  const PRODUCT_ORIGIN='https://peaceful-world-org.github.io';
  const PRODUCT_BASE=PRODUCT_ORIGIN+'/true-cost-of-war';
  const overviewSrc=PRODUCT_BASE+'/unified/product.html?lang='+lang+'&embed=1';
  const detailsSrc=PRODUCT_BASE+'/model-v2-lab/index.html?lang='+lang+'&embed=1';

  if(!document.head.querySelector('link[data-pw-tcow-preconnect]')){
    const preconnect=document.createElement('link');
    preconnect.rel='preconnect';
    preconnect.href=PRODUCT_ORIGIN;
    preconnect.dataset.pwTcowPreconnect='true';
    document.head.appendChild(preconnect);

    const dns=document.createElement('link');
    dns.rel='dns-prefetch';
    dns.href='//peaceful-world-org.github.io';
    dns.dataset.pwTcowPreconnect='true';
    document.head.appendChild(dns);
  }

  const iframe=document.createElement('iframe');
  iframe.id='pw-tcow-current-product-rc';
  iframe.dataset.pwTcowRc=lang;
  iframe.dataset.pwSessionClock='parent-authoritative';
  iframe.title=lang==='ru'?'Истинная цена войны':'The True Cost of War';
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
      #pw-tcow-parent-view-switch{
        top:auto;right:auto;left:50%;
        bottom:calc(2px + env(safe-area-inset-bottom,0px));
        max-width:214px;
        transform:translate(-50%,10px) scale(.98)
      }
      #pw-tcow-parent-view-switch.is-visible{transform:translate(-50%,0) scale(1)}
      #pw-tcow-parent-view-switch button{min-width:84px;min-height:30px;padding:5px 10px;font-size:10.5px}
    }
    #pw-tcow-parent-session-counter{
      position:fixed;top:96px;right:22px;z-index:999998;
      display:flex;min-width:202px;max-width:218px;flex-direction:column;gap:3px;
      padding:9px 12px 8px;border:1px solid rgba(201,196,184,.86);border-radius:14px;
      background:rgba(255,254,251,.95);box-shadow:0 5px 16px rgba(24,26,23,.065);
      backdrop-filter:blur(12px);color:#181a17;
      opacity:0;pointer-events:none;transform:translateY(-8px) scale(.98);
      transition:opacity .16s ease,transform .16s ease;
    }
    #pw-tcow-parent-session-counter.is-visible{
      opacity:1;transform:translateY(0) scale(1);
    }
    #pw-tcow-parent-session-counter .pw-live-label{
      display:flex;align-items:center;gap:6px;color:#5f625b;
      font:780 8.6px/1.2 Inter,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;
      white-space:nowrap;
    }
    #pw-tcow-parent-session-counter .pw-live-dot{
      width:7px;height:7px;flex:0 0 7px;border-radius:50%;background:#b5483d;
      box-shadow:0 0 0 3px rgba(181,72,61,.10);
    }
    #pw-tcow-parent-session-counter .pw-live-value{
      color:#181a17;font:850 20.5px/1.08 Inter,system-ui,sans-serif;
      font-variant-numeric:tabular-nums;letter-spacing:-.025em;white-space:nowrap;
    }
    #pw-tcow-parent-session-counter .pw-live-note{
      margin-top:0;color:#696b65;font:570 9.1px/1.2 Inter,system-ui,sans-serif;
      letter-spacing:0;white-space:nowrap;
    }
    @media(max-width:980px){
      #pw-tcow-parent-session-counter{
        top:4px;right:auto;left:50%;bottom:auto;
        min-width:0;max-width:176px;padding:6px 10px;border-radius:11px;gap:1px;
        transform:translate(-50%,-6px) scale(.98);
      }
      #pw-tcow-parent-session-counter.is-visible{transform:translate(-50%,0) scale(1)}
      #pw-tcow-parent-session-counter .pw-live-label{justify-content:center;font-size:7.4px;letter-spacing:.035em}
      #pw-tcow-parent-session-counter .pw-live-dot{width:6px;height:6px;flex-basis:6px}
      #pw-tcow-parent-session-counter .pw-live-value{text-align:center;font-size:16px;line-height:1.05}
      #pw-tcow-parent-session-counter .pw-live-note{display:none}
    }
    @media(prefers-reduced-motion:reduce){
      #pw-tcow-parent-view-switch,#pw-tcow-parent-session-counter{transition:none}
    }
  `;
  document.head.appendChild(chromeStyle);

  const sessionCounter=document.createElement('aside');
  sessionCounter.id='pw-tcow-parent-session-counter';
  sessionCounter.dataset.pwSessionCounter='true';
  sessionCounter.dataset.pwClockOwner='parent';
  sessionCounter.setAttribute(
    'aria-label',
    lang==='ru'?'Мировые военные расходы за время просмотра':'World military spending during your viewing session'
  );
  sessionCounter.title=lang==='ru'
    ? 'Расчёт: $2,887 трлн ÷ 365,25 ÷ 24 ÷ 60 ÷ 60 × активное время просмотра.'
    : 'Calculation: $2.887 trillion ÷ 365.25 ÷ 24 ÷ 60 ÷ 60 × active viewing time.';
  sessionCounter.innerHTML=`
    <div class="pw-live-label"><span class="pw-live-dot" aria-hidden="true"></span><span>${lang==='ru'?'ЗА ВРЕМЯ ПРОСМОТРА':'WHILE VIEWING'}</span></div>
    <div class="pw-live-value" data-live-value>≈ $ 0</div>
    <div class="pw-live-note">${lang==='ru'?'мировые военные расходы · ср. темп 2025':'world military expenditure · 2025 avg. rate'}</div>
  `;

  const annualSpend=2887000000000;
  const secondsPerYear=365.25*24*60*60;
  const spendPerSecond=annualSpend/secondsPerYear;

  let activeAccumulatedMs=0;
  let activeSince=document.hidden?null:performance.now();
  let latestSessionCardBottom=NaN;

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
        return '$ '+new Intl.NumberFormat(locale,{
          minimumFractionDigits:digits,
          maximumFractionDigits:digits
        }).format(scaled)+' '+suffix;
      }
    }
    return '$ '+new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(abs);
  }

  function postSessionTick({seed=false}={}){
    const elapsedMs=activeElapsedMs();
    if(!iframe.contentWindow) return;
    iframe.contentWindow.postMessage({type:'pw2-session-tick',elapsedMs},PRODUCT_ORIGIN);
    if(seed){
      iframe.contentWindow.postMessage({type:'pw2-session-seed',elapsedMs},PRODUCT_ORIGIN);
    }
  }

  function updateSessionCounter(){
    const elapsedMs=activeElapsedMs();
    const value=spendPerSecond*(elapsedMs/1000);
    sessionCounter.querySelector('[data-live-value]').textContent='≈ '+formatSessionSpend(value);
    sessionCounter.dataset.pwLiveValue=String(Math.floor(value));
    sessionCounter.dataset.pwLiveElapsedMs=String(Math.round(elapsedMs));
    postSessionTick();
  }

  document.addEventListener('visibilitychange',()=>{
    setViewingActive(!document.hidden);
    updateSessionCounter();
  });

  const sessionInterval=setInterval(updateSessionCounter,250);
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
    if(normalized==='overview') latestSessionCardBottom=NaN;
    syncFloatingVisibility();
  }
  setActiveView('overview');

  function mobileHeaderBottom(){
    const x=Math.max(1,Math.min(window.innerWidth-2,window.innerWidth/2));
    const stack=document.elementsFromPoint?document.elementsFromPoint(x,2):[];
    let bottom=0;
    const seen=new Set();
    for(const start of stack){
      let node=start;
      for(let depth=0;node&&depth<7;depth+=1,node=node.parentElement){
        if(seen.has(node)) continue;
        seen.add(node);
        if(node===sessionCounter||node===viewSwitch) continue;
        const style=getComputedStyle(node);
        if(style.position!=='fixed'&&style.position!=='sticky') continue;
        const r=node.getBoundingClientRect();
        if(r.top<=4&&r.bottom>bottom&&r.width>=window.innerWidth*.55&&r.height>36&&r.height<180){
          bottom=r.bottom;
        }
      }
    }
    return Math.min(150,Math.max(0,bottom));
  }

  function syncFloatingVisibility(){
    const rect=iframe.getBoundingClientRect();
    const activeView=viewSwitch.dataset.pwActiveView||'overview';
    const overlapsViewport=rect.bottom>120&&rect.top<(window.innerHeight-80);
    const mobile=window.matchMedia('(max-width:980px)').matches;

    if(mobile) sessionCounter.style.top=Math.round(mobileHeaderBottom()+4)+'px';
    else sessionCounter.style.top='';

    const mobileSwitchThreshold=activeView==='details'?-240:-420;
    const viewSwitchVisible=(mobile?rect.top<mobileSwitchThreshold:rect.top<-110)&&overlapsViewport;
    viewSwitch.classList.toggle('is-visible',viewSwitchVisible);
    viewSwitch.dataset.pwFloatingVisible=String(viewSwitchVisible);

    let counterVisible=false;
    if(activeView==='details'){
      counterVisible=rect.top<-240&&overlapsViewport;
    }else if(Number.isFinite(latestSessionCardBottom)){
      const handoffBoundary=mobile?mobileHeaderBottom()+8:104;
      const inlineBottomInParent=rect.top+latestSessionCardBottom;
      counterVisible=overlapsViewport&&inlineBottomInParent<=handoffBoundary;
    }

    sessionCounter.classList.toggle('is-visible',counterVisible);
    sessionCounter.dataset.pwLiveVisible=String(counterVisible);
    sessionCounter.dataset.pwVisibilityOwner='loader-handoff';
  }

  window.addEventListener('scroll',syncFloatingVisibility,{passive:true});
  window.addEventListener('resize',syncFloatingVisibility,{passive:true});

  function onMessage(event){
    if(event.origin!==PRODUCT_ORIGIN) return;
    if(event.source!==iframe.contentWindow) return;

    iframe.dataset.pwMessageOrigin='matched';
    iframe.dataset.pwMessageType=String(event.data?.type||'unknown');
    iframe.dataset.pwMessageSource='matched';

    if(event.data?.type==='pw2-session-ready'){
      postSessionTick({seed:true});
      return;
    }

    if(event.data?.type==='pw2-session-state'){
      const bottom=Number(event.data.sessionCardBottom);
      if(Number.isFinite(bottom)) latestSessionCardBottom=bottom;
      syncFloatingVisibility();
      return;
    }

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
      iframe.contentWindow?.postMessage({type:'pw2-request-resize'},PRODUCT_ORIGIN);
      iframe.contentWindow?.postMessage({type:'pw2-request-view'},PRODUCT_ORIGIN);
      postSessionTick({seed:true});
    }catch(_){}
  }

  iframe.addEventListener('load',()=>{
    iframe.dataset.pwLoad='true';
    requestState();
    setTimeout(requestState,80);
    setTimeout(requestState,220);
    setTimeout(requestState,650);
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

  window.addEventListener('pagehide',()=>clearInterval(sessionInterval),{once:true});
})();
