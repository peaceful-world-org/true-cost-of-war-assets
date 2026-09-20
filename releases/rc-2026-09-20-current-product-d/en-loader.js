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
    @media(prefers-reduced-motion:reduce){#pw-tcow-parent-view-switch{transition:none}}
  `;
  document.head.appendChild(chromeStyle);

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
    const passedTop=rect.top < -110;
    const overlapsViewport=rect.bottom > 120 && rect.top < (window.innerHeight-80);
    const visible=passedTop && overlapsViewport;
    viewSwitch.classList.toggle('is-visible',visible);
    viewSwitch.dataset.pwFloatingVisible=String(visible);
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

  syncFloatingVisibility();
  setTimeout(requestState,1200);
  setTimeout(requestState,3000);
  setTimeout(syncFloatingVisibility,300);
})();

