const hd=document.getElementById('hd');
if(hd)addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>50),{passive:true});
// 라이트/다크 수동 토글 (기본값: 시스템 따라감, 선택 시 localStorage 저장)
(function(){var KEY='goldspa-theme';
var saved=null;try{saved=localStorage.getItem(KEY);}catch(e){}
if(saved==='light'||saved==='dark')document.documentElement.setAttribute('data-theme',saved);
document.querySelectorAll('.themetoggle').forEach(function(btn){
  btn.addEventListener('click',function(){
    var cur=document.documentElement.getAttribute('data-theme');
    if(!cur)cur=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
    var next=cur==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    try{localStorage.setItem(KEY,next);}catch(e){}
  });
});})();
(function(){var tg=document.querySelector('.navtoggle'),mm=document.getElementById('mmenu');if(!tg||!mm)return;
function set(o){tg.classList.toggle('open',o);mm.classList.toggle('open',o);tg.setAttribute('aria-expanded',o);tg.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기');document.body.style.overflow=o?'hidden':'';}
tg.addEventListener('click',function(){set(!mm.classList.contains('open'));});
mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
var mmClose=mm.querySelector('.mmenu-close');if(mmClose)mmClose.addEventListener('click',function(){set(false);});
addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});})();
// stagger groups: give siblings in a grid a small incremental delay (Emil: 30-80ms)
document.querySelectorAll('.fac-grid,.spec,.trust .band,.quotes,.figrow,.matrow,.gallery-cols').forEach(g=>{
  [...g.children].forEach((el,i)=>{el.style.transitionDelay=(i*55)+'ms'});
});
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rise,.unveil').forEach(el=>io.observe(el));
(function(){
  /* /en/ 하위 페이지는 한 단계 깊으므로 이미지 경로에 ../ 접두사가 필요하다.
     (HTML 안의 img 는 페이지별로 경로를 맞추지만, 아래처럼 JS가 하드코딩한 경로는 여기서 보정) */
  var IMGBASE=/\/en\//.test(location.pathname)?"../":"";
  const IMG={"hero":IMGBASE+"images/p005.jpg","emotion":IMGBASE+"images/p046.jpg","hygiene":IMGBASE+"images/p048.jpg"}; const order=[];
  function setbg(el,key){
    if(!el||!key||!IMG[key])return;
    el.style.backgroundImage="url('"+IMG[key]+"')";
    el.style.backgroundSize="cover";el.style.backgroundPosition="center";el.style.backgroundColor="#eee";
    const p=el.querySelector(".plabel"); if(p)p.style.display="none";
    el.classList.add("in"); const u=el.closest(".unveil"); if(u)u.classList.add("in");
  }
  (function heroSlides(){
    var media=document.querySelector(".hero-media"); if(!media)return;
    var srcs=[IMGBASE+"images/p005.jpg",IMGBASE+"images/pajugold_032.jpg",IMGBASE+"images/pajugold_045.jpg"];
    var pl=media.querySelector(".plabel"); if(pl)pl.style.display="none";
    var slides=srcs.map(function(src,i){
      var d=document.createElement("div"); d.className="hero-slide"+(i===0?" on":"");
      d.style.backgroundImage="url('"+src+"')"; media.insertBefore(d,media.firstChild); return d;
    });
    media.classList.add("in"); var u=media.closest(".unveil"); if(u)u.classList.add("in");
    var bars=[].slice.call(document.querySelectorAll(".hero-prog .hp-bar"));
    var cur=0,timer=null,DUR=5000;
    function paint(){
      slides.forEach(function(s,i){s.classList.toggle("on",i===cur);});
      bars.forEach(function(b,i){
        b.classList.remove("active","done");
        if(i<cur)b.classList.add("done");
        else if(i===cur){void b.offsetWidth; b.classList.add("active");}
      });
    }
    function go(n){cur=(n+slides.length)%slides.length; paint();}
    function start(){ if(timer)clearInterval(timer);
      timer=setInterval(function(){go(cur+1);},DUR); }
    bars.forEach(function(b,i){b.addEventListener("click",function(){go(i);start();});});
    if(slides.length<2){paint();return;}
    paint(); start();
  })();
  setbg(document.querySelector(".emotion"),"emotion");
  document.querySelectorAll(".shot").forEach((el,i)=>setbg(el,order[i]));
})();
(function(){var t=document.querySelector('.foods-track');if(!t)return;
var prev=document.querySelector('.fprev'),next=document.querySelector('.fnext'),dotsWrap=document.querySelector('.foods-nav .dots');
var items=t.querySelectorAll('.food-tile');
function step(){var a=items[0].getBoundingClientRect(),b=items[1]?items[1].getBoundingClientRect():a;return (b.left-a.left)||a.width;}
function pages(){var st=step();return Math.max(1,Math.round((t.scrollWidth-t.clientWidth)/st)+1);}
function idx(){return Math.round(t.scrollLeft/step());}
function build(){dotsWrap.innerHTML='';for(var i=0;i<pages();i++)dotsWrap.appendChild(document.createElement('i'));sync();}
function sync(){var cur=idx(),ds=dotsWrap.children;for(var i=0;i<ds.length;i++)ds[i].classList.toggle('on',i===cur);
var max=t.scrollWidth-t.clientWidth-2;prev.disabled=t.scrollLeft<=2;next.disabled=t.scrollLeft>=max;}
function go(d){var max=t.scrollWidth-t.clientWidth-2;if(d>0&&t.scrollLeft>=max){t.scrollTo({left:0,behavior:'smooth'});}else{t.scrollBy({left:d*step(),behavior:'smooth'});}}
prev.onclick=function(){go(-1);hold();};
next.onclick=function(){go(1);hold();};
var timer=null,paused=false;
function hold(){if(timer)clearInterval(timer);timer=setInterval(function(){if(!paused)go(1);},3200);}
hold();
var wrap=t.closest('.foods-carousel');
wrap.addEventListener('mouseenter',function(){paused=true;});
wrap.addEventListener('mouseleave',function(){paused=false;});
t.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',build);build();})();
(function(){var b=document.getElementById('galMore');if(!b)return;
b.addEventListener('click',function(){
  var m=document.querySelector('.mosaic');var ex=m.classList.toggle('expanded');
  m.querySelectorAll('.mtile.more').forEach(function(t){t.classList.add('in')});
  b.textContent=ex?'접기':'갤러리 더보기';
});})();
(function(){var t=document.querySelector('.hy-track');if(!t)return;
var p=document.querySelector('.hprev'),n=document.querySelector('.hnext');
if(p)p.addEventListener('click',function(){t.scrollBy({left:-t.clientWidth*0.7,behavior:'smooth'})});
if(n)n.addEventListener('click',function(){t.scrollBy({left:t.clientWidth*0.7,behavior:'smooth'})});})();
(function(){var s=document.getElementById('splash');if(!s)return;
document.documentElement.style.overflow='hidden';
function done(){if(s.classList.contains('done'))return;s.classList.add('done');document.documentElement.style.overflow='';}
setTimeout(done,2900);
})();
(function(){var t=document.querySelector('.gal-track');if(!t)return;
function step(d){var it=t.querySelector('.gal-item');var w=it?it.getBoundingClientRect().width+16:t.clientWidth*0.8;t.scrollBy({left:d*w,behavior:'smooth'});}
var p=document.querySelector('.gprev'),n=document.querySelector('.gnext');
if(p)p.addEventListener('click',function(){step(-1)});
if(n)n.addEventListener('click',function(){step(1)});})();
/* 라이트박스: 검사 성적서 원본 + 시설 갤러리(클릭하면 크게 보기)
   이전/다음 버튼은 페이지마다 마크업을 고치지 않도록 여기서 주입한다. */
(function(){var lb=document.getElementById('docLightbox');if(!lb)return;
var img=lb.querySelector('img'),cap=lb.querySelector('figcaption'),closeBtn=lb.querySelector('.lb-close');
var group=[],idx=-1,last=null;
var prev=document.createElement('button'),next=document.createElement('button');
prev.className='lb-prev';next.className='lb-next';prev.type='button';next.type='button';
prev.setAttribute('aria-label','이전 사진');next.setAttribute('aria-label','다음 사진');
prev.innerHTML='&#8249;';next.innerHTML='&#8250;';lb.appendChild(prev);lb.appendChild(next);

function visible(el){return !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length);}
function clean(s){return (s||'').replace(/\s*[—–-]\s*파주 골드스파\s*$/,'').trim();}
function show(i){if(!group.length)return;idx=(i+group.length)%group.length;var it=group[idx];
  img.src=it.src;img.alt=it.cap;cap.textContent=it.cap;
  var multi=group.length>1;prev.style.display=multi?'':'none';next.style.display=multi?'':'none';}
function open(list,i){group=list;last=list[i].el;show(i);
  lb.classList.add('open');lb.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';closeBtn.focus();}
function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');
  document.body.style.overflow='';img.src='';group=[];if(last)last.focus();}

/* 1) 검사 성적서 */
var docs=[].slice.call(document.querySelectorAll('.pw-doc'));
docs.forEach(function(b,i){b.addEventListener('click',function(){
  open(docs.map(function(x){return {el:x,src:x.getAttribute('data-full'),cap:x.getAttribute('data-cap')||''};}),i);});});

/* 2) 시설 갤러리 — 화면에 실제로 보이는 사진만 묶는다(모바일에서 숨긴 컷 제외) */
var imgs=[].slice.call(document.querySelectorAll('.gal-item img,.fac-media img'));
imgs.forEach(function(im){im.addEventListener('click',function(){
  var list=imgs.filter(visible).map(function(x){return {el:x,src:x.getAttribute('src'),cap:clean(x.getAttribute('alt'))};});
  var i=-1;list.forEach(function(x,k){if(x.el===im)i=k;});
  if(i<0)return;open(list,i);});});

prev.addEventListener('click',function(e){e.stopPropagation();show(idx-1);});
next.addEventListener('click',function(e){e.stopPropagation();show(idx+1);});
closeBtn.addEventListener('click',close);
lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-fig'))close();});
addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(idx-1);else if(e.key==='ArrowRight')show(idx+1);});
/* 모바일 스와이프 */
var x0=null;
lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;
  if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));x0=null;},{passive:true});})();
/* 시설 스트립 — 자동 무한 흐름(마퀴).
   이동은 CSS 애니메이션이 맡고, 여기서는 이음매가 안 보이도록 원본 세트를 한 벌 복제한다.
   트랙이 정확히 2배가 되므로 -50% 지점이 원본 시작과 완전히 겹친다. */
(function(){
  var track=document.querySelector('.fs-track'); if(!track)return;
  var imgs=[].slice.call(track.children); if(!imgs.length)return;
  imgs.forEach(function(im){
    var c=im.cloneNode(true); c.setAttribute('aria-hidden','true'); track.appendChild(c);
  });
})();
