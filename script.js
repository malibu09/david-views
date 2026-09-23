// Hero: el video principal debe estar listo y reproducirse sin clic.
const heroVideo=document.querySelector('.hero-video');
if(heroVideo){
  heroVideo.muted=true; heroVideo.defaultMuted=true; heroVideo.playsInline=true;
  const showHero=()=>heroVideo.classList.add('is-ready');
  heroVideo.addEventListener('loadeddata',showHero,{once:true});
  heroVideo.addEventListener('canplay',()=>{showHero();heroVideo.play().catch(()=>{});},{once:true});
  if(heroVideo.readyState>=2){showHero();heroVideo.play().catch(()=>{});}
  else heroVideo.load();
}

const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const videoIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const v=e.target,src=v.querySelector('source[data-src]');if(src){src.src=src.dataset.src;src.removeAttribute('data-src');v.load()}videoIO.unobserve(v)}),{rootMargin:'250px'});document.querySelectorAll('video').forEach(v=>videoIO.observe(v));
document.querySelectorAll('.video-toggle').forEach(btn=>btn.addEventListener('click',()=>{const v=btn.parentElement.querySelector('video');if(!v)return;if(v.paused){document.querySelectorAll('video').forEach(x=>{if(x!==v)x.pause()});v.play().then(()=>btn.textContent='Ⅱ').catch(()=>{});}else{v.pause();btn.textContent='▶'}}));document.querySelectorAll('video').forEach(v=>v.addEventListener('pause',()=>{const b=v.parentElement.querySelector('.video-toggle');if(b)b.textContent='▶'}));
// Ambiente cinematográfico ligero: luz y profundidad responden al cursor.
// Se evita el canvas de grano continuo para reducir CPU/GPU y consumo de batería.
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  const root=document.documentElement, heroVisual=document.querySelector('.hero-visual');
  let tx=innerWidth*.5,ty=innerHeight*.28,cx=tx,cy=ty,raf=0;
  const paint=()=>{
    cx+=(tx-cx)*.08; cy+=(ty-cy)*.08;
    root.style.setProperty('--pointer-x',`${(cx/innerWidth)*100}%`);
    root.style.setProperty('--pointer-y',`${(cy/innerHeight)*100}%`);
    if(heroVisual){
      const r=heroVisual.getBoundingClientRect(),phone=heroVisual.querySelector('.phone');
      if(phone&&r.bottom>0&&r.top<innerHeight){
        const nx=Math.max(-1,Math.min(1,(cx-(r.left+r.width/2))/(r.width/2)));
        const ny=Math.max(-1,Math.min(1,(cy-(r.top+r.height/2))/(r.height/2)));
        phone.style.transform=`perspective(900px) rotateY(${nx*2.2}deg) rotateX(${-ny*1.7}deg)`;
      }
    }
    if(Math.abs(tx-cx)>.3||Math.abs(ty-cy)>.3) raf=requestAnimationFrame(paint); else raf=0;
  };
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(paint)},{passive:true});
})();

// V4: timeline editorial progress — subtle, no external animation library.
(() => {
  const timeline = document.querySelector('.timeline-demo');
  const playhead = timeline?.querySelector('.playhead');
  if (!timeline || !playhead || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  const update = () => {
    const r = timeline.getBoundingClientRect();
    const vh = innerHeight;
    const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    playhead.style.animation = 'none';
    playhead.style.left = `${4 + progress * 92}%`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
  update();
})();

// V4.3 — motion that guides the visitor instead of decorating the page.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.querySelector('.site-progress i');
  const process = document.querySelector('.steps');
  const steps = [...document.querySelectorAll('.step')];
  const miniFlow = document.querySelector('.mini-flow');
  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pageProgress = max > 0 ? scrollY / max : 0;
    if (progressBar) progressBar.style.width = `${Math.max(0, Math.min(1, pageProgress)) * 100}%`;

    if (process && steps.length) {
      const r = process.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .72 - r.top) / Math.max(1, r.height * .72)));
      process.style.setProperty('--process-progress', `${p * 86}%`);
      const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach((el, i) => el.classList.toggle('is-current', p > .02 && i <= active));
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
  addEventListener('resize', update, {passive:true});
  update();

  if (miniFlow) {
    const flowObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) miniFlow.classList.add('is-active');
    }, {threshold:.55});
    flowObserver.observe(miniFlow);
  }

  if (!reduced) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${e.clientX-r.left}px`);
        card.style.setProperty('--card-y', `${e.clientY-r.top}px`);
      }, {passive:true});
    });
  }
})();



// V5.1 — WhatsApp is the closing step of the funnel.
// Add the number in international format, digits only. Example Mexico: 52 + 10-digit number.
const WHATSAPP_NUMBER='';
(()=>{
  const options=[...document.querySelectorAll('.wa-option')];
  const preview=document.getElementById('waPreview');
  const button=document.getElementById('whatsappBtn');
  const status=document.getElementById('waStatus');
  let service='Reels / Shorts / TikTok';
  const message=()=>`Hola David Views 👋 Me interesa cotizar edición de ${service}. Tengo material y me gustaría contarte mi proyecto.`;
  const select=value=>{
    service=value||service;
    options.forEach(o=>o.classList.toggle('is-selected',o.dataset.waService===service));
    if(preview)preview.textContent=message();
  };
  options.forEach(o=>o.addEventListener('click',()=>select(o.dataset.waService)));
  document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
    const map={'Reel / Short / TikTok':'Reels / Shorts / TikTok','Video de YouTube':'Video de YouTube','Video para negocio o marca':'Video para negocio o marca'};
    select(map[link.dataset.service]||link.dataset.service);
  }));
  button?.addEventListener('click',()=>{
    const number=WHATSAPP_NUMBER.replace(/\D/g,'');
    if(!number){
      if(status)status.textContent='Falta conectar el número de WhatsApp de David Views.';
      return;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message())}`,'_blank','noopener,noreferrer');
  });
  select(service);
})();
