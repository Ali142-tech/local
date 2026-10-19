const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// nav, progress bar, burger
const nav=$('nav'),bar=$('#bar');
addEventListener('scroll',()=>{
  nav.classList.toggle('solid',scrollY>30);
  bar.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';
});
nav.classList.toggle('solid',scrollY>30);
$('.burger').onclick=()=>$('.links').classList.toggle('open');

// page transition
$$('a[href$=".html"]').forEach(a=>a.addEventListener('click',e=>{
  if(a.target||e.metaKey||e.ctrlKey)return;
  e.preventDefault();document.body.classList.add('leaving');
  setTimeout(()=>location.href=a.href,320);
}));

// scroll reveal (staggered)
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.15});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*.1+'s';io.observe(el)});

// counters
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;co.unobserve(e.target);
  const t=+e.target.dataset.n,sfx=e.target.dataset.s||'';let s=null;
  const step=ts=>{s??=ts;const p=Math.min((ts-s)/1800,1);
    e.target.textContent=Math.floor(t*(1-Math.pow(1-p,3)))+sfx;
    if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}),{threshold:.5});
$$('[data-n]').forEach(el=>co.observe(el));

// floating particles
const pt=$('.particles');
if(pt)for(let i=0;i<26;i++){
  const s=document.createElement('span');
  s.style.left=Math.random()*100+'%';
  s.style.animationDuration=8+Math.random()*12+'s';
  s.style.animationDelay=-Math.random()*15+'s';
  s.style.transform=`scale(${.5+Math.random()*1.5})`;
  pt.appendChild(s);
}

// 3D tilt on cards
$$('.card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`;
  });
  c.addEventListener('mouseleave',()=>c.style.transform='');
});

// hero parallax
const hero=$('.hero');
if(hero)hero.addEventListener('mousemove',e=>{
  const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  $$('.blob',hero).forEach((b,i)=>b.style.translate=`${x*(i+1)*40}px ${y*(i+1)*40}px`);
});

// service filter tabs
$$('.tabs button').forEach(b=>b.onclick=()=>{
  $$('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  $$('.card[data-cat]').forEach(c=>{
    const show=b.dataset.f==='all'||c.dataset.cat===b.dataset.f;
    c.classList.toggle('hide',!show);
    if(show){c.classList.remove('in');void c.offsetWidth;c.classList.add('in')}
  });
});

// review slider
const ri=$('.rev-in');
if(ri){
  const n=ri.children.length,dots=$('.dots');let i=0,t;
  for(let k=0;k<n;k++){const d=document.createElement('i');d.onclick=()=>go(k);dots.appendChild(d)}
  const go=k=>{i=(k+n)%n;ri.style.transform=`translateX(-${i*100}%)`;
    [...dots.children].forEach((d,j)=>d.classList.toggle('on',j===i));clearInterval(t);t=setInterval(()=>go(i+1),5000)};
  go(0);
}

// theme toggle
$('#theme').onclick=()=>{
  const t=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=t;
  try{localStorage.setItem('theme',t)}catch(e){}
};

// contact form -> email (FormSubmit.co). Set CONTACT_EMAIL once the address is known.
const CONTACT_EMAIL='';   // <-- put the company email here, e.g. 'info@yourcompany.com'
const WA_FALLBACK='971541659474';
const form=$('form');
if(form)form.addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=$('button[type=submit]',form),ok=$('.ok'),d=Object.fromEntries(new FormData(form));
  const show=(m,c)=>{ok.textContent=m;ok.style.color=c||'';ok.classList.add('show')};
  if(!CONTACT_EMAIL){
    const msg='Hello FIIT Trading,%0AName: '+encodeURIComponent(d.name)+'%0AEmail: '+encodeURIComponent(d.email)+'%0AInterest: '+encodeURIComponent(d.product)+'%0A'+encodeURIComponent(d.message);
    show('Opening WhatsApp to send your enquiry…');
    setTimeout(()=>window.open('https://wa.me/'+WA_FALLBACK+'?text='+msg,'_blank'),600);return;
  }
  btn.disabled=true;btn.textContent='Sending…';
  try{
    const r=await fetch('https://formsubmit.co/ajax/'+CONTACT_EMAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({name:d.name,company:d.company,email:d.email,interested_in:d.product,message:d.message,_subject:'New website enquiry from '+d.name,_replyto:d.email,_template:'table',_captcha:'false'})});
    const j=await r.json();
    if(!r.ok||j.success==='false')throw 0;
    show('✅ Thank you! Your message has been sent. We will contact you shortly.');form.reset();
  }catch(err){show('❌ Sorry, something went wrong. Please WhatsApp us on +971 54 165 9474.','#d33')}
  btn.disabled=false;btn.textContent='Send Message';
});

// image galleries & hero slideshow
const IMGS=Array.from({length:24},(_,i)=>'images/p'+String(i+1).padStart(2,'0')+'.jpg');
const hb=$('.hero-bg');
if(hb){
  IMGS.slice(0,8).forEach(s=>{const im=new Image();im.src=s;im.alt='';hb.appendChild(im)});
  let h=0;const hs=[...hb.children];hs[0].classList.add('on');
  setInterval(()=>{hs[h].classList.remove('on');h=(h+1)%hs.length;hs[h].classList.add('on')},5000);
}
$$('.gal').forEach(g=>{
  const stage=$('.gal-stage',g),th=$('.thumbs',g),cnt=$('.gal-count',g),pr=$('.gal-prog',g);
  const ims=[],tms=[];
  IMGS.forEach((s,i)=>{const a=new Image();a.src=s;a.alt='FIIT Trading project '+(i+1);stage.appendChild(a);ims.push(a);
    const t=new Image();t.src=s;t.alt='';t.onclick=()=>show(i);th.appendChild(t);tms.push(t)});
  let c=0,tm;const D=5000;
  function show(i){
    c=(i+ims.length)%ims.length;
    ims.forEach((x,k)=>x.classList.toggle('on',k===c));tms.forEach((x,k)=>x.classList.toggle('on',k===c));
    cnt.textContent=String(c+1).padStart(2,'0')+' / '+ims.length;
    th.scrollTo({left:tms[c].offsetLeft-th.clientWidth/2+52,behavior:'smooth'});
    pr.style.transition='none';pr.style.width='0';void pr.offsetWidth;pr.style.transition='width '+D+'ms linear';pr.style.width='100%';
    clearTimeout(tm);tm=setTimeout(()=>show(c+1),D);
  }
  $('.prev',g).onclick=()=>show(c-1);$('.next',g).onclick=()=>show(c+1);
  let x0=null;stage.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  stage.addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)show(c+(d<0?1:-1));x0=null});
  g.addEventListener('mouseenter',()=>{clearTimeout(tm);pr.style.transition='none';pr.style.width='0'});
  g.addEventListener('mouseleave',()=>show(c));
  show(0);
});

// ===== WOW layer =====
const cur=$('.cursor');
if(cur&&matchMedia('(hover:hover)').matches)addEventListener('mousemove',e=>{cur.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'});
// animate hero headline word by word
$$('.hero h1').forEach(h=>{
  let i=0;
  const mk=w=>{const s=document.createElement('span');s.className='w';s.textContent=w;s.style.animationDelay=(.15+i++*.12)+'s';return s};
  [...h.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w=>{if(!w.trim())f.append(w);else f.append(mk(w))});c.replaceWith(f)}
    else if(c.classList&&c.classList.contains('grad')){const t=c.textContent;c.textContent='';t.split(' ').forEach(w=>{const s=mk(w);c.append(s,' ')})}
  });
});
// typing rotator
const rot=$('#rot');
if(rot){
  const L=['Modular Post Pallets','Angle Frame Pallets','Metal Base Pallets','Nestainers','Drum Pallets','Smartrack Racking'];
  let li=0,ci=L[0].length,mode='del';
  (function tick(){
    let d=70;
    if(mode==='del'){ci--;d=35;if(ci<=0){mode='type';li=(li+1)%L.length}}
    else if(mode==='type'){ci++;if(ci>=L[li].length){mode='del';d=1600}}
    rot.textContent=L[li].slice(0,Math.max(ci,0));
    setTimeout(tick,d);
  })();
}
// magnetic buttons
$$('.btn').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.2)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
  b.addEventListener('mouseleave',()=>b.style.translate='');
});
