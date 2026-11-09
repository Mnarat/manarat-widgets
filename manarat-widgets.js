/* ============================================================
   manarat-widgets.js — جمعية منارات مكة للعناية بالمساجد (متجر زد mmcm.sa)
   منقول من hamah-widgets.js (هامة) بإعدادات منارات. ملف واحد يبني:
   (1) صندوق «كلمات من أهل الخير» (يظهر فقط إذا وُجدت تقييمات حقيقية في قسم «آراء العملاء» بالثيم)
   (2) «آخر التبرعات»: صندوق في الرئيسية + إشعار في الداخلية (معطّل حتى يُضبط dataUrl بمصدر بيانات منارات)
   (3) نص الوصف المختصر تحت اسم المشروع في بطاقات الفرص
   يُحمَّل من كود JS الثيم (var hv=2) عبر jsDelivr برقم commit كامل، لا @main.
   ============================================================ */
(function () {
  'use strict';

  /* ===================== الإعدادات (عدّل هنا فقط) ===================== */
  var CFG = {
    orgName: 'جمعية منارات مكة',
    color: '#052560',                 // كحلي منارات (نص أبيض واضح عليه). الفيروزي #00b5a7 للمسات
    font: '"Almarai","Tajawal","Segoe UI",Tahoma,sans-serif',

    /* --- صندوق التقييمات --- */
    reviewsEnabled: true,
    reviewsTitle: 'كلمات من أهل الخير',
    reviewsTarget: 'footer',          // يُدرج الصندوق قبل هذا العنصر (CSS selector). غيّره إن احتجت مكاناً آخر
    reviewsLink: '',                  // فارغ = لا يظهر زر «المزيد من التقييمات» (الصندوق يبقى ظاهراً دائماً)
    reviewsPerWeek: 12,
    reviewsAutoMs: 4000,
    /* مصدر التقييمات من قسم «آراء العملاء» في قالب إيثار (تُعبّأ من لوحة زد).
       المحدّدات مأخوذة من قالب إيثار (نفسها في hamh.sa). اتركها فارغة لتعطيل هذا المصدر. */
    ethar: {
      section: '.type_testimonials',
      item:    '.quote_col',
      name:    '.quote_author',
      text:    '.quote_content p'
    },
    REVIEWS: [
      // تقييمات حقيقية فقط. مثال:
      // { name: "", stars: 5, text: "نص التقييم كما كتبه المتبرع", date: "2026-11-08" },
    ],

    /* --- آخر التبرعات --- */
    donationsEnabled: true,
    dataUrl: 'https://script.google.com/macros/s/AKfycbxOCyVW3p9Z9JifvgZ9etFPWniN_y4MbLh4gNbEvraTrEcuMuoqAp56iDRlGzNFxIBi/exec',                      // فارغ = «آخر التبرعات» معطّل. يُملأ برابط Google Apps Script خاص بمنارات (لا يُستخدم رابط هامة أبدًا)
    donationsTarget: 'after-reviews', // 'after-reviews' = مباشرة تحت صندوق التقييمات (أو قبل الفوتر إن لم يوجد)، أو CSS selector مثل 'footer'
    donateLink: '/products/daily-blessing',  // رابط زر «تبرّع الآن» (بركتك اليومية)
    homePaths: ['/'],
    skipPaths: ['/cart','/checkout','/payment','/thank','/orders','/account','/auth'],
    showName: false,                  // false = الكل يظهر «فاعل خير» (الأكثر أماناً). true = الاسم الأول إن وُجد
    hideAmount: false,
    show: 5, rotateMs: 3500, refreshMs: 60000,
    minAmount: 20, urgentWord: 'عاجل', timeMaxMin: 60,
    maxAgeHours: 72, fallback: true, fallbackDays: 90,
    toastFirst: 6000, toastEvery: 20000, toastStay: 6000, toastMax: 5
  };
  /* ===================================================================== */

  function esc(s){ return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
  function seeded(seed){ return function(){ seed=(seed*9301+49297)%233280; return seed/233280; }; }
  function shuffle(arr, rnd){ for(var i=arr.length-1;i>0;i--){ var j=Math.floor(rnd()*(i+1)); var t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }
  function path(){ return location.pathname.replace(/\/+$/,'') || '/'; }
  function isHome(){ return CFG.homePaths.indexOf(path()) > -1; }
  function mount(target, node){ var t=document.querySelector(target); if(t && t.parentNode) t.parentNode.insertBefore(node, t); else document.body.appendChild(node); }

  /* ===================== CSS ===================== */
  var css = '\
.hm-reviews{--hm-main:'+CFG.color+';--hm-star:#f5b301;font-family:'+CFG.font+';padding:48px 16px;background:#fff;overflow:hidden;direction:rtl}\
.hm-reviews *,.hm-live *,.hm-toast *{box-sizing:border-box}\
.hm-reviews h2{text-align:center;color:var(--hm-main);font-size:28px;margin:0 0 32px;font-weight:700}\
.hm-track-wrap{max-width:1240px;margin:0 auto;position:relative;overflow:hidden;padding:8px 8px 24px}\
.hm-track{display:flex;gap:24px;transition:transform .7s cubic-bezier(.4,0,.2,1)}\
.hm-card{flex:0 0 calc(25% - 18px);background:#fff;border-radius:16px;padding:26px 24px 22px;min-height:230px;box-shadow:0 4px 18px rgba(0,0,0,.06);border:1.5px solid transparent;display:flex;flex-direction:column;opacity:.9;transform:scale(.98);transition:all .5s}\
.hm-card.is-active{border-color:var(--hm-main);opacity:1;transform:scale(1)}\
.hm-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}\
.hm-stars{color:var(--hm-star);font-size:20px;letter-spacing:3px}.hm-stars .off{color:#ddd}\
.hm-quote{color:var(--hm-main);font-size:40px;line-height:.6;font-family:Georgia,serif;transform:scaleX(-1)}\
.hm-text{color:#333;font-size:15px;line-height:1.8;flex:1;font-style:italic}\
.hm-who{display:flex;align-items:center;gap:10px;margin-top:16px}\
.hm-avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:20px;font-weight:700;overflow:hidden;flex:0 0 44px}.hm-avatar img{width:100%;height:100%;object-fit:cover;display:block}\
.hm-name{font-weight:700;color:#333;font-size:15px}.hm-date{color:#777;font-size:12px;margin-right:auto}\
.hm-dots{display:flex;justify-content:center;gap:10px;margin:28px 0 24px}\
.hm-dots button{width:12px!important;height:12px!important;min-width:0!important;min-height:0!important;max-height:12px!important;line-height:0!important;font-size:0!important;border-radius:50%!important;border:0!important;background:#cfcfcf!important;cursor:pointer;padding:0!important;margin:0!important;box-shadow:none!important;appearance:none;-webkit-appearance:none;flex:0 0 12px;display:block;transition:.3s}\
.hm-dots button.on{background:var(--hm-main)!important;transform:scale(1.15)}\
.hm-more{display:flex;justify-content:center}\
.hm-more a{display:inline-flex;align-items:center;justify-content:center;gap:10px;line-height:1;border:1.5px solid var(--hm-main);color:var(--hm-main);padding:15px 34px;border-radius:40px;text-decoration:none;font-size:17px;transition:.3s}\
.hm-more a:hover{background:var(--hm-main);color:#fff}\
.hm-empty{text-align:center;color:#777;padding:30px;font-size:16px}.hm-empty a{color:var(--hm-main);font-weight:700}\
@media(max-width:1024px){.hm-card{flex-basis:calc(50% - 12px)}}\
@media(max-width:600px){.hm-card{flex-basis:100%}.hm-card,.hm-card.is-active{transform:none}.hm-reviews h2{font-size:22px}}\
.hm-live{--c:'+CFG.color+';font-family:'+CFG.font+';max-width:1240px;margin:40px auto;padding:0 16px;direction:rtl}\
.hm-live-box{background:#EAF8F7;border:1px solid #CFEDEA;border-radius:18px;padding:22px 24px;position:relative;overflow:hidden}\
.hm-live-head{display:flex;align-items:center;gap:10px;margin-bottom:16px}.hm-live-head h3{margin:0;color:var(--c);font-size:20px;font-weight:700}\
.hm-pulse{width:10px;height:10px;border-radius:50%;background:#2ecc71;position:relative}\
.hm-pulse::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid #2ecc71;animation:hmPulse 1.6s infinite}\
@keyframes hmPulse{0%{transform:scale(.5);opacity:1}100%{transform:scale(1.4);opacity:0}}\
.hm-live-list{display:flex;flex-direction:column;gap:10px;overflow:hidden}\
.hm-live-item{display:flex;align-items:center;gap:14px;background:#fff;border-radius:14px;padding:12px 16px;box-shadow:0 3px 12px rgba(0,0,0,.05);animation:hmIn .6s cubic-bezier(.2,.8,.2,1) both}\
@keyframes hmIn{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:none}}\
.hm-live-av{width:42px;height:42px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:18px;flex:0 0 42px}\
.hm-live-txt{flex:1;color:#333;font-size:15px;line-height:1.6}.hm-live-txt b{color:var(--c)}\
.hm-live-amt{font-weight:700;color:#222;font-size:17px;white-space:nowrap}.hm-live-time{color:#888;font-size:12px;white-space:nowrap;margin-right:8px}\
.hm-live-cta{text-align:center;margin-top:18px}\
.hm-live-cta a{display:inline-block;background:var(--c);color:#fff;text-decoration:none;padding:12px 32px;border-radius:40px;font-size:16px;transition:.3s}\
.hm-live-empty{color:#777;text-align:center;padding:30px 0;font-size:15px}\
@media(max-width:600px){.hm-live-item{flex-wrap:wrap}.hm-live-time{width:100%;margin:4px 0 0;text-align:left}}\
.hm-toast{position:fixed;bottom:24px;left:24px;z-index:99999;direction:rtl;font-family:'+CFG.font+';display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:14px 18px 14px 22px;min-width:300px;max-width:min(420px,calc(100vw - 48px));box-shadow:0 10px 30px rgba(0,0,0,.14);border-right:5px solid '+CFG.color+';transform:translateY(140%);opacity:0;transition:transform .55s cubic-bezier(.2,.9,.3,1.2),opacity .4s}\
.hm-toast.show{transform:none;opacity:1}\
.hm-toast-ic{width:48px;height:48px;border-radius:50%;background:#E0F5F3;display:grid;place-items:center;font-size:22px;flex:0 0 48px}\
.hm-toast-body{flex:1;min-width:0}.hm-toast-t{color:#222;font-size:15px;line-height:1.5;font-weight:500}.hm-toast-t b{color:'+CFG.color+';font-weight:700}\
.hm-toast-s{color:#8a8a8a;font-size:12px;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}\
.hm-toast-x{position:absolute;top:6px;left:8px;border:0;background:none;color:#bbb;font-size:16px;cursor:pointer;padding:2px 6px;line-height:1}\
.hm-toast-bar{position:absolute;bottom:0;right:0;height:3px;background:'+CFG.color+';width:100%;transform-origin:right;animation:hmBar linear forwards}\
@keyframes hmBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}\
@media(max-width:600px){.hm-toast{left:12px;right:12px;bottom:12px;max-width:none;min-width:0}}';
  document.head.appendChild(el('style', null, css));

  /* ===================== 1) صندوق التقييمات ===================== */
  var AV_COLORS = [CFG.color, '#00b5a7', '#008F85'];
  function avatar(rv){
    var name = (rv.name || '').trim();
    if (rv.img) return '<span class="hm-avatar"><img src="'+esc(rv.img)+'" alt=""></span>';
    var first = name ? name.charAt(0) : '';
    var sum = 0; for (var i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    var bg = AV_COLORS[sum % AV_COLORS.length];
    return '<span class="hm-avatar" style="background:'+bg+'">'+(first ? esc(first) : '🤲')+'</span>';
  }
  function buildReviews(){
    if (!CFG.reviewsEnabled || !isHome()) return;
    var source = CFG.REVIEWS.slice(), etharSec = null;
    if (CFG.ethar && CFG.ethar.section && CFG.ethar.item){
      etharSec = document.querySelector(CFG.ethar.section);
      if (etharSec){
        var seen = {};
        etharSec.querySelectorAll(CFG.ethar.item).forEach(function(it){
          var nameEl = CFG.ethar.name ? it.querySelector(CFG.ethar.name) : null, textEl = CFG.ethar.text ? it.querySelector(CFG.ethar.text) : null;
          var text = (textEl ? textEl.textContent : it.textContent).trim().replace(/\s+/g,' ');
          if (!text || seen[text]) return; seen[text] = 1;            /* إيثار يكرر العناصر في السلايدر */
          var imgEl = it.querySelector('img'), img = imgEl && imgEl.getAttribute('src') && !/placeholder|no-image|default/i.test(imgEl.src) && imgEl.naturalWidth > 2 ? imgEl.src : '';
          source.push({ name: nameEl ? nameEl.textContent.trim() : '', stars: 5, text: text, img: img });
        });
      }
    }
    var sec = el('section','hm-reviews'); sec.setAttribute('dir','rtl');
    sec.innerHTML = '<h2>'+esc(CFG.reviewsTitle)+'</h2><div class="hm-track-wrap"><div class="hm-track"></div></div><div class="hm-dots"></div>'+
      (CFG.reviewsLink ? '<div class="hm-more"><a href="'+esc(CFG.reviewsLink)+'"><span>★</span><span>المزيد من التقييمات</span></a></div>' : '');
    if (etharSec){ etharSec.parentNode.insertBefore(sec, etharSec); etharSec.style.display = 'none'; } else { mount(CFG.reviewsTarget, sec); }
    if (!CFG.donationsTarget || CFG.donationsTarget === 'after-reviews') { CFG._afterReviews = sec; }
    var track = sec.querySelector('.hm-track'), dots = sec.querySelector('.hm-dots');
    var week = Math.floor(Date.now()/(7*86400000));
    var shown = shuffle(source, seeded(week)).slice(0, CFG.reviewsPerWeek);
    if (!shown.length){ sec.remove(); if (etharSec) etharSec.style.display = ''; CFG._afterReviews = null; return; } /* لا تقييمات = لا صندوق (منارات) */
    function stars(n){ var s=''; for(var k=1;k<=5;k++) s+='<span'+(k>n?' class="off"':'')+'>★</span>'; return s; }
    shown.forEach(function(rv){
      track.appendChild(el('article','hm-card','<div class="hm-top"><div class="hm-stars">'+stars(rv.stars||5)+'</div><span class="hm-quote">”</span></div>'+
        '<p class="hm-text">"'+esc(rv.text)+'"</p><div class="hm-who">'+avatar(rv)+'<span class="hm-name">'+esc(rv.name||'فاعل خير')+'</span>'+(rv.date?'<span class="hm-date">'+esc(rv.date)+'</span>':'')+'</div>'));
    });
    var cards = track.children, idx = 0, timer;
    function perView(){ var w=innerWidth; return w<=600?1:w<=1024?2:4; }
    function pages(){ return Math.max(1, cards.length-perView()+1); }
    function go(n){ idx=(n+pages())%pages(); var cw=cards[0].offsetWidth, gap=parseFloat(getComputedStyle(track).columnGap)||24; track.style.transform='translateX('+(idx*(cw+gap))+'px)';
      for(var c=0;c<cards.length;c++) cards[c].classList.toggle('is-active',c===idx); for(var d=0;d<dots.children.length;d++) dots.children[d].classList.toggle('on',d===idx); }
    function buildDots(){ dots.innerHTML=''; for(var p=0;p<pages();p++){ var b=el('button'); b.setAttribute('aria-label','تقييم '+(p+1)); b.onclick=(function(p){return function(){go(p);restart();};})(p); dots.appendChild(b);} }
    function restart(){ clearInterval(timer); timer=setInterval(function(){go(idx+1);},CFG.reviewsAutoMs); }
    track.parentNode.addEventListener('mouseenter',function(){clearInterval(timer);}); track.parentNode.addEventListener('mouseleave',restart);
    addEventListener('resize',function(){buildDots();go(0);}); buildDots(); go(0); restart();
  }

  /* ===================== 2) آخر التبرعات ===================== */
  function buildDonations(){
    if (!CFG.donationsEnabled || !CFG.dataUrl) return;
    var p = path(); if (CFG.skipPaths.some(function(s){ return p.indexOf(s)===0; })) return;
    var home = isHome(), DON = [], items = [], pastMode = false, ptr = 0, timer, box, list, head;
    function fmt(n){ return Number(n).toLocaleString('en-US')+' ريال'; }
    function ago(t){ var m=Math.max(0,Math.round((Date.now()-new Date(t))/60000)); if(m>CFG.timeMaxMin) return ''; if(m<1) return 'الآن'; return 'قبل '+m+' دقيقة'; }
    function urgent(d){ return !!(CFG.urgentWord && d.project && d.project.indexOf(CFG.urgentWord)>-1); }
    function rank(a,b){ var ua=urgent(a)?1:0, ub=urgent(b)?1:0; if(ua!==ub) return ub-ua; var am=Number(a.amount)||0, bm=Number(b.amount)||0; if(am!==bm) return bm-am; return new Date(b.time)-new Date(a.time); }
    function nm(d){ return CFG.showName && d.name ? d.name : 'فاعل خير'; }
    function compute(){
      var now = Date.now();
      var ok = DON.filter(function(d){ return d && d.time && (Number(d.amount)||0) >= CFG.minAmount; });
      items = ok.filter(function(d){ return (now-new Date(d.time)) < CFG.maxAgeHours*3600000; }).sort(rank);
      pastMode = false;
      if (!items.length && CFG.fallback){
        items = ok.filter(function(d){ return (now-new Date(d.time)) < CFG.fallbackDays*86400000; }).sort(rank); pastMode = items.length > 0;
      }
    }
    /* --- الصندوق (الرئيسية) --- */
    function card(d){ return el('div','hm-live-item','<span class="hm-live-av">🤲</span><span class="hm-live-txt"><b>'+esc(nm(d))+'</b> تبرّع'+(d.project?' لـ <b>'+esc(d.project)+'</b>':'')+'</span>'+
      (CFG.hideAmount||!d.amount?'':'<span class="hm-live-amt">'+fmt(d.amount)+'</span>')+(pastMode||!ago(d.time)?'':'<span class="hm-live-time">'+ago(d.time)+'</span>')); }
    function renderBox(){
      if (!box){ box = el('section','hm-live'); box.setAttribute('dir','rtl');
        box.innerHTML='<div class="hm-live-box"><div class="hm-live-head"><span class="hm-pulse"></span><h3>آخر التبرعات</h3></div><div class="hm-live-list"></div><div class="hm-live-cta"><a href="'+esc(CFG.donateLink)+'">شارك أهل الخير وتبرّع الآن</a></div></div>';
        if (CFG._afterReviews) CFG._afterReviews.parentNode.insertBefore(box, CFG._afterReviews); else mount(CFG.donationsTarget === 'after-reviews' ? 'footer' : CFG.donationsTarget, box);
        list = box.querySelector('.hm-live-list'); head = box.querySelector('h3');
        list.parentNode.addEventListener('mouseenter',function(){clearInterval(timer);}); list.parentNode.addEventListener('mouseleave',renderBox); }
      clearInterval(timer); list.innerHTML=''; head.textContent = pastMode ? 'من تبرعات الأيام الماضية' : 'آخر التبرعات';
      if (!items.length){ list.innerHTML='<p class="hm-live-empty">كن أول المتبرعين اليوم 🤍</p>'; return; }
      var n=Math.min(CFG.show, items.length); for(var i=n-1;i>=0;i--) list.prepend(card(items[i])); ptr=n%items.length;
      if (items.length>CFG.show) timer=setInterval(function(){ list.prepend(card(items[ptr])); ptr=(ptr+1)%items.length; while(list.children.length>CFG.show) list.removeChild(list.lastChild); }, CFG.rotateMs);
    }
    /* --- الإشعار (الداخلية) --- */
    var toastEl, toastTimer, count = 0, started = false;
    function showToast(d){
      if (!toastEl){ toastEl = el('div','hm-toast'); toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
      var sub = []; if (d.city) sub.push('📍 '+esc(d.city)); sub.push(esc(CFG.orgName)); if (!pastMode && ago(d.time)) sub.push(ago(d.time));
      toastEl.innerHTML = '<span class="hm-toast-ic">🤲</span><div class="hm-toast-body"><div class="hm-toast-t"><b>'+esc(nm(d))+'</b> تبرّع'+(CFG.hideAmount||!d.amount?'':' بـ <b>'+fmt(d.amount)+'</b>')+(d.project?' لـ <b>'+esc(d.project)+'</b>':'')+'</div><div class="hm-toast-s">'+sub.join(' <span>•</span> ')+'</div></div>'+
        '<button class="hm-toast-x" aria-label="إغلاق">✕</button><span class="hm-toast-bar" style="animation-duration:'+CFG.toastStay+'ms"></span>';
      toastEl.querySelector('.hm-toast-x').onclick = function(){ toastEl.classList.remove('show'); count = CFG.toastMax; };
      requestAnimationFrame(function(){ toastEl.classList.add('show'); });
      clearTimeout(toastTimer); toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, CFG.toastStay);
    }
    function runToasts(){
      if (started || !items.length) return; started = true; var i = 0;
      (function next(){ if (count>=CFG.toastMax) return; if (!document.hidden){ showToast(items[i%items.length]); i++; count++; } setTimeout(next, CFG.toastEvery); })();
    }
    function load(){
      fetch(CFG.dataUrl, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ DON = Array.isArray(j)?j:(j.data||[]); compute(); home ? renderBox() : (setTimeout(runToasts, started?0:CFG.toastFirst)); }).catch(function(){});
    }
    load(); setInterval(load, CFG.refreshMs);
  }

  function init(){ try { buildReviews(); } catch(e){} try { buildDonations(); } catch(e){} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* MN-CARD-DESC 2026-11-09: يعرض نص الوصف المختصر (بدون ##share##) تحت اسم المشروع في بطاقات الفرص */
(function(){
  var busy=false;
  var NBSP=new RegExp(String.fromCharCode(160),'g');
  function run(){
    if(busy) return; busy=true;
    try{
      var cards=document.querySelectorAll('.product-inner[data-short-description]');
      for(var i=0;i<cards.length;i++){
        var el=cards[i];
        if(el.querySelector('.hm-card-desc')) continue;
        var info=el.querySelector('.product-info'); if(!info) continue;
        var raw=el.getAttribute('data-short-description')||'';
        var d=document.createElement('div');
        d.innerHTML=raw.replace(/##[\s\S]*?##/g,'');
        var txt=(d.textContent||'').replace(NBSP,' ').replace(/\s+/g,' ').trim();
        if(!txt) continue;
        var p=document.createElement('p'); p.className='hm-card-desc'; p.textContent=txt;
        info.insertBefore(p, info.firstChild);
      }
    }catch(e){}
    busy=false;
  }
  run();
  document.addEventListener('DOMContentLoaded',run);
  if(window.MutationObserver){ new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true}); }
})();

/* HM-FIX-LINKS: footer logo index.html -> / and remove hidden loyalty popup (2026-11-09) */
(function(){
  function fixLinks(){
    document.querySelectorAll('a[href="index.html"],a[href$="/index.html"]').forEach(function(a){ a.setAttribute('href','/'); });
    document.querySelectorAll('.loyalty-rewards-popup').forEach(function(p){ p.remove(); });
    document.querySelectorAll('a[href*="loyalty-program-info"]').forEach(function(a){ a.remove(); });
  }
  if(document.readyState!=='loading') fixLinks(); else document.addEventListener('DOMContentLoaded',fixLinks);
  window.addEventListener('load',fixLinks);
  setTimeout(fixLinks,3000);
})();

/* MN-CSS-SYNC 2026-11-10: زد يقدّم لصفحات /products والفرص والتصنيفات والصفحات الداخلية نسخة قديمة مجمّدة من «كود CSS الخاص».
   هذا الجزء ينسخ CSS المنشور من الرئيسية (المصدر الوحيد: سجل CSS في محرر الثيم) ويضيفه للصفحة إن كان ناقصًا. يُحفظ في المتصفح ساعة. */
(function(){
  var MARK='MN-CARD-LIKE-OLD', KEY='mn_css_sync_v1', TTL=3600000;
  function hasCurrent(){ var s=document.querySelectorAll('style'); for(var i=0;i<s.length;i++){ if(s[i].id!=='mn-css-sync' && s[i].textContent.indexOf(MARK)>-1) return true; } return false; }
  function apply(css){ if(!css) return; var el=document.getElementById('mn-css-sync'); if(!el){ el=document.createElement('style'); el.id='mn-css-sync'; } if(el.textContent!==css) el.textContent=css; (document.head||document.documentElement).appendChild(el); }
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ return null; } }
  function save(css){ try{ localStorage.setItem(KEY, JSON.stringify({t:Date.now(), css:css})); }catch(e){} }
  function refresh(){
    fetch('/', {credentials:'same-origin', cache:'no-store'}).then(function(r){ return r.text(); }).then(function(html){
      var re=/<style[^>]*>([\s\S]*?)<\/style>/g, m;
      while((m=re.exec(html))){ if(m[1].indexOf(MARK)>-1){ save(m[1]); if(!hasCurrent()) apply(m[1]); return; } }
    }).catch(function(){});
  }
  function run(){
    if(hasCurrent()) return;
    var c=read();
    if(c && c.css) apply(c.css);
    if(!c || !c.css || (Date.now()-c.t)>TTL) refresh();
  }
  if(document.head && document.querySelector('style')) run(); else document.addEventListener('DOMContentLoaded', run);
})();
