/* ============================================================
   manarat-widgets.js — جمعية منارات مكة للعناية بالمساجد (متجر زد mmcm.sa)
   منقول من hamah-widgets.js (هامة) بإعدادات منارات. ملف واحد يبني:
   (1) صندوق «كلمات من أهل الخير» (يظهر فقط إذا وُجدت تقييمات حقيقية في قسم «آراء العملاء» بالثيم)
   (2) «آخر التبرعات والإهداءات»: صندوق في الرئيسية + إشعار في الداخلية. مصدران: التبرعات (dataUrl) والإهداءات (giftFeedUrl)، وأيهما تعطّل يظهر الآخر
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
    dataUrl: 'https://script.google.com/macros/s/AKfycbxOCyVW3p9Z9JifvgZ9etFPWniN_y4MbLh4gNbEvraTrEcuMuoqAp56iDRlGzNFxIBi/exec',                      // فارغ = «آخر التبرعات» معطّل. يُملأ برابط Google Apps Script خاص بمنارات (لا يُستخدم رابط هامة أبداً)
    donationsTarget: 'after-reviews', // 'after-reviews' = مباشرة تحت صندوق التقييمات (أو قبل الفوتر إن لم يوجد)، أو CSS selector مثل 'footer'
    donateLink: '/products/daily-blessing',  // رابط زر «تبرّع الآن» (بركتك اليومية)
    homePaths: ['/'],
    skipPaths: ['/cart','/checkout','/payment','/thank','/orders','/account','/auth'],
    showName: false,                  // false = الكل يظهر «فاعل خير» (الأكثر أماناً). true = الاسم الأول إن وُجد
    hideAmount: false,
    show: 5, rotateMs: 3500, refreshMs: 60000,
    minAmount: 20, urgentWord: 'عاجل', timeMaxMin: 60,
    maxAgeHours: 72, fallback: true, fallbackDays: 90,
    toastFirst: 6000, toastEvery: 20000, toastStay: 6000, toastMax: 5,

    /* --- الإهداءات داخل «آخر التبرعات والإهداءات» --- */
    giftsEnabled: true,               // false = الصندوق والإشعار للتبرعات فقط
    giftFeedUrl: 'https://script.google.com/macros/s/AKfycbzhHWK26ak8ucCVJDBRm8XSMSBSXGg5GAzFPwDt5mvDk8lPJcG9djh4_72PKwtqZI11tA/exec?a=feed',   // سكربت «أهدِ من تحب» نفسه (API في gift.js) + ?a=feed
    giftRefreshMs: 300000             // الإهداءات تُحدَّث كل 5 دقائق (أخف على سكربت الإهداء)
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
.hm-live-av.hm-av-don,.hm-toast-ic.hm-av-don{background:#E0F5F3}\
.hm-live-av.hm-av-gift,.hm-toast-ic.hm-av-gift{background:#FFF1DC}\
.hm-ic{display:block;width:24px;height:24px;flex:0 0 auto}\
.hm-toast-ic .hm-ic{width:28px;height:28px}\
@media (prefers-reduced-motion:no-preference){@keyframes hmBeat{0%,100%{transform:scale(1)}25%{transform:scale(1.07)}50%{transform:scale(1)}}.hm-toast-ic .hm-ic-gift g{transform-box:fill-box;transform-origin:center bottom;animation:hmBeat 2.8s ease-in-out infinite}}\
@media(max-width:600px){.hm-live-item{flex-wrap:wrap}.hm-live-time{width:100%;margin:4px 0 0;text-align:left}}\
.hm-toast{position:fixed;bottom:24px;left:24px;z-index:99999;direction:rtl;font-family:'+CFG.font+';display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:14px 23px 14px 34px;min-width:300px;max-width:min(420px,calc(100vw - 48px));box-shadow:0 10px 30px rgba(0,0,0,.14);overflow:hidden;transform:translateY(140%);opacity:0;transition:transform .55s cubic-bezier(.2,.9,.3,1.2),opacity .4s}\
.hm-toast.show{transform:none;opacity:1}\
.hm-toast-ic{width:48px;height:48px;border-radius:50%;background:#E0F5F3;display:grid;place-items:center;font-size:22px;flex:0 0 48px}\
.hm-toast-body{flex:1;min-width:0}.hm-toast-t{color:#222;font-size:15px;line-height:1.5;font-weight:500}.hm-toast-t b{color:'+CFG.color+';font-weight:700}\
.hm-toast-s{color:#8a8a8a;font-size:12px;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}\
.hm-toast-x{position:absolute;top:6px;left:8px;border:0;background:none;color:#bbb;font-size:16px;cursor:pointer;padding:2px 6px;line-height:1}\
.hm-toast-bar{position:absolute;top:0;right:0;bottom:0;left:0;border-radius:inherit;box-shadow:inset -5px 0 0 '+CFG.color+';pointer-events:none;-webkit-clip-path:inset(0 0 0 0);clip-path:inset(0 0 0 0);animation:hmBar linear forwards}\
@keyframes hmBar{from{-webkit-clip-path:inset(0 0 0 0);clip-path:inset(0 0 0 0)}to{-webkit-clip-path:inset(0 0 100% 0);clip-path:inset(0 0 100% 0)}}\
@media (prefers-reduced-motion:reduce){.hm-toast{transition:opacity .2s;transform:none}.hm-toast-bar{animation:none}}\
@media(max-width:600px){.hm-toast{left:12px;right:12px;bottom:12px;max-width:none;min-width:0}}\
@media(max-width:820px){.hm-toast{bottom:120px}}';
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

  /* ===================== 2) آخر التبرعات والإهداءات ===================== */
  /* أيقونة التبرع: قلب فيروزي فوق كف كحلية (ألوان الهوية). أيقونة الإهداء: نفس هدية «أهدِ من تحب» في gift.js */
  var IC_DON = '<svg class="hm-ic" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 33C32 33 18 24.5 18 15.5C18 10.5 21.8 7 26 7C28.6 7 30.9 8.4 32 10.6C33.1 8.4 35.4 7 38 7C42.2 7 46 10.5 46 15.5C46 24.5 32 33 32 33Z" fill="#00B5A7"/><rect x="5" y="38" width="9" height="19" rx="2.5" fill="#052560"/><path d="M17 40H25C27.6 40 30 40.9 32 42.4L34.2 44H41C43.2 44 45 45.6 45 47.6C45 47.9 45 48.2 44.9 48.5L53.6 44.6C55.7 43.7 58.1 44.6 59 46.6C59.8 48.5 59 50.7 57.2 51.7L41.5 59.6C39.2 60.8 36.5 61 34 60.3L17 55.6Z" fill="#052560"/></svg>';
  var IC_GIFT = '<svg class="hm-ic hm-ic-gift" viewBox="0 0 64 64" aria-hidden="true"><g><rect x="14" y="30" width="36" height="25" rx="4" fill="#E53935"/><rect x="14" y="32" width="36" height="3" fill="#7A1515" fill-opacity=".45"/><rect x="29" y="35" width="6" height="20" fill="#F5B52A"/><rect x="10" y="22" width="44" height="10" rx="3" fill="#C62828"/><rect x="28" y="22" width="8" height="10" fill="#F5B52A"/><path d="M32 22C25 22 17 20 17 14.5C17 10 23 10 26 13.5C29 17 32 22 32 22Z" fill="none" stroke="#F5B52A" stroke-width="3" stroke-linejoin="round"/><path d="M32 22C39 22 47 20 47 14.5C47 10 41 10 38 13.5C35 17 32 22 32 22Z" fill="none" stroke="#F5B52A" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="22" r="4" fill="#F5A300"/></g></svg>';
  /* صياغة المناسبة بعد «فاعل خير أهدى تبرّعاً في «المشروع»». المفتاح = اسم المناسبة كما يرجعه سكربت الإهداء.
     ما ليس هنا يُكتب «بمناسبة + الاسم». الفارغ = بلا إضافة. */
  var OCC_SAY = {
    'إهداء عام': '',
    'مولود جديد': 'فرحاً بمولود جديد',
    'زواج': 'بمناسبة الزواج',
    'تخرّج': 'بمناسبة التخرّج',
    'نجاح وتفوّق': 'بمناسبة النجاح والتفوّق',
    'حج أو عمرة': 'بمناسبة الحج أو العمرة',
    'وظيفة أو ترقية': 'بمناسبة وظيفة جديدة أو ترقية',
    'منزل جديد': 'بمناسبة المنزل الجديد',
    'رمضان': 'بمناسبة شهر رمضان',
    'عشر ذي الحجة': 'في عشر ذي الحجة',
    'شكر وتقدير': 'شكراً وتقديراً',
    'برّ الوالدين': 'برّاً بالوالدين',
    'دعاء لمريض بالشفاء': 'مع الدعاء لمريض بالشفاء',
    'الحمد لله على السلامة': 'حمداً لله على السلامة'
  };
  function buildDonations(){
    var useDon = !!CFG.dataUrl, useGift = !!(CFG.giftsEnabled && CFG.giftFeedUrl);
    if (!CFG.donationsEnabled || (!useDon && !useGift)) return;
    var p = path(); if (CFG.skipPaths.some(function(s){ return p.indexOf(s)===0; })) return;
    var home = isHome(), DON = [], GIFTS = [], items = [], pastMode = false, ptr = 0, timer, box, list, head, okOnce = false, lastGift = 0;
    function fmt(n){ return Number(n).toLocaleString('en-US')+' ريال'; }
    function ago(t){ var m=Math.max(0,Math.round((Date.now()-new Date(t))/60000)); if(m>CFG.timeMaxMin) return ''; if(m<1) return 'الآن'; return 'قبل '+m+' دقيقة'; }
    function isGift(d){ return d.t === 'gift'; }
    function urgent(d){ return !isGift(d) && !!(CFG.urgentWord && d.project && d.project.indexOf(CFG.urgentWord)>-1); }
    /* الترتيب: التبرعات العاجلة أولاً (الأكبر ثم الأحدث كما كانت)، ثم التبرعات والإهداءات معاً من الأحدث إلى الأقدم */
    function rank(a,b){ var ua=urgent(a)?1:0, ub=urgent(b)?1:0; if(ua!==ub) return ub-ua; var am=Number(a.amount)||0, bm=Number(b.amount)||0, dt=new Date(b.time)-new Date(a.time);
      if(ua){ if(am!==bm) return bm-am; return dt; } if(dt) return dt; return bm-am; }
    function nm(d){ return CFG.showName && d.name ? d.name : 'فاعل خير'; }
    /* الإهداء: لا نأخذ من المصدر إلا المشروع والمناسبة والوقت. لا أسماء ولا رموز ولا مبالغ (وعد لوحة الإهداء) */
    function cleanGift(g){ return { t:'gift', project:String(g.project||''), occ:String(g.occ||''), dead:!!g.dead || String(g.occ||'')==='صدقة عن متوفى', time:g.time }; }
    function giftHtml(d){
      var pr = d.project ? ' في <b>«'+esc(d.project)+'»</b>' : '';
      if (d.dead) return '<b>فاعل خير</b> تصدّق'+pr+' <span style="white-space:nowrap">عن متوفى</span>';
      var say = Object.prototype.hasOwnProperty.call(OCC_SAY, d.occ) ? OCC_SAY[d.occ] : (d.occ ? 'بمناسبة '+d.occ : '');
      return '<b>فاعل خير</b> أهدى تبرّعاً'+pr+(say ? ' '+esc(say) : '');
    }
    /* الصدقة عن متوفى تأخذ أيقونة التبرع الهادئة، لا علبة الهدية */
    function avCls(d){ return isGift(d) && !d.dead ? 'hm-av-gift' : 'hm-av-don'; }
    function avIc(d){ return isGift(d) && !d.dead ? IC_GIFT : IC_DON; }
    function compute(){
      var now = Date.now();
      var ok = DON.filter(function(d){ return d && d.time && !isNaN(new Date(d.time)) && (Number(d.amount)||0) >= CFG.minAmount; })   /* minAmount للتبرعات فقط */
        .concat(GIFTS.filter(function(g){ return g && g.time && !isNaN(new Date(g.time)); }));
      items = ok.filter(function(d){ return (now-new Date(d.time)) < CFG.maxAgeHours*3600000; }).sort(rank);
      pastMode = false;
      if (!items.length && CFG.fallback){
        items = ok.filter(function(d){ return (now-new Date(d.time)) < CFG.fallbackDays*86400000; }).sort(rank); pastMode = items.length > 0;
      }
    }
    /* --- الصندوق (الرئيسية) --- */
    function card(d){
      var time = pastMode||!ago(d.time)?'':'<span class="hm-live-time">'+ago(d.time)+'</span>', av = '<span class="hm-live-av '+avCls(d)+'">'+avIc(d)+'</span>';
      if (isGift(d)) return el('div','hm-live-item', av+'<span class="hm-live-txt">'+giftHtml(d)+'</span>'+time);
      return el('div','hm-live-item', av+'<span class="hm-live-txt"><b>'+esc(nm(d))+'</b> تبرّع'+(d.project?' لـ <b>'+esc(d.project)+'</b>':'')+'</span>'+
        (CFG.hideAmount||!d.amount?'':'<span class="hm-live-amt">'+fmt(d.amount)+'</span>')+time); }
    function renderBox(){
      if (!box){ box = el('section','hm-live'); box.setAttribute('dir','rtl');
        box.innerHTML='<div class="hm-live-box"><div class="hm-live-head"><span class="hm-pulse"></span><h3>آخر التبرعات والإهداءات</h3></div><div class="hm-live-list"></div><div class="hm-live-cta"><a href="'+esc(CFG.donateLink)+'">شارك أهل الخير وتبرّع الآن</a></div></div>';
        if (CFG._afterReviews) CFG._afterReviews.parentNode.insertBefore(box, CFG._afterReviews); else mount(CFG.donationsTarget === 'after-reviews' ? 'footer' : CFG.donationsTarget, box);
        list = box.querySelector('.hm-live-list'); head = box.querySelector('h3');
        list.parentNode.addEventListener('mouseenter',function(){clearInterval(timer);}); list.parentNode.addEventListener('mouseleave',renderBox); }
      clearInterval(timer); list.innerHTML=''; head.textContent = pastMode ? 'من تبرعات وإهداءات الأيام الماضية' : 'آخر التبرعات والإهداءات';
      if (!items.length){ list.innerHTML='<p class="hm-live-empty">كن أول من يتبرّع أو يُهدي اليوم 🤍</p>'; return; }
      var n=Math.min(CFG.show, items.length); for(var i=n-1;i>=0;i--){ var c0=card(items[i]); c0.setAttribute('data-k',i); list.prepend(c0); } ptr=n%items.length;
      if (items.length>CFG.show) timer=setInterval(function(){ var k=ptr%items.length, c=card(items[k]); c.setAttribute('data-k',k); var old=list.querySelector('[data-k="'+k+'"]'); if(old) list.removeChild(old); list.prepend(c); ptr=(ptr+1)%items.length; while(list.children.length>CFG.show) list.removeChild(list.lastChild); }, CFG.rotateMs);
    }
    /* --- الإشعار (الداخلية) --- */
    var toastEl, toastTimer, count = 0, started = false;
    function showToast(d){
      if (!toastEl){ toastEl = el('div','hm-toast'); toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
      var sub = []; if (!isGift(d) && d.city) sub.push('📍 '+esc(d.city)); sub.push(esc(CFG.orgName)); if (!pastMode && ago(d.time)) sub.push(ago(d.time));
      var txt = isGift(d) ? giftHtml(d) : '<b>'+esc(nm(d))+'</b> تبرّع'+(CFG.hideAmount||!d.amount?'':' بـ <b>'+fmt(d.amount)+'</b>')+(d.project?' لـ <b>'+esc(d.project)+'</b>':'');
      toastEl.innerHTML = '<span class="hm-toast-ic '+avCls(d)+'">'+avIc(d)+'</span><div class="hm-toast-body"><div class="hm-toast-t">'+txt+'</div><div class="hm-toast-s">'+sub.join(' <span>•</span> ')+'</div></div>'+
        '<button class="hm-toast-x" aria-label="إغلاق">✕</button><span class="hm-toast-bar" style="animation-duration:'+CFG.toastStay+'ms"></span>';
      toastEl.querySelector('.hm-toast-x').onclick = function(){ toastEl.classList.remove('show'); count = CFG.toastMax; };
      requestAnimationFrame(function(){ toastEl.classList.add('show'); });
      clearTimeout(toastTimer); toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, CFG.toastStay);
    }
    function runToasts(){
      if (started || !items.length) return; started = true; var i = 0;
      (function next(){ if (count>=CFG.toastMax) return; if (!document.hidden && items.length){ showToast(items[i%items.length]); i++; count++; } setTimeout(next, CFG.toastEvery); })();
    }
    /* المصدران يُجلبان معاً. إن فشل أحدهما بقي الآخر. وإن تأخر أحدهما أكثر من 5 ثوانٍ نعرض ما وصل ثم نحدّث عند وصوله */
    function paint(){ if (!okOnce) return; compute(); if (home) renderBox(); else setTimeout(runToasts, started?0:CFG.toastFirst); }
    function load(){
      var left = 0, late = false, tm = 0;
      function end(){ left--; if (left <= 0 || late){ clearTimeout(tm); paint(); } }
      var doGift = useGift && (Date.now() - lastGift >= (CFG.giftRefreshMs||0) - 1000);
      if (useDon) left++; if (doGift) left++;
      if (!left) return;
      if (left > 1) tm = setTimeout(function(){ late = true; paint(); }, 5000);
      if (useDon) fetch(CFG.dataUrl, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ DON = Array.isArray(j)?j:((j&&j.data)||[]); okOnce = true; }).catch(function(){}).then(end);
      if (doGift){ lastGift = Date.now();
        fetch(CFG.giftFeedUrl, {cache:'no-store'}).then(function(r){ return r.json(); }).then(function(j){ if (Array.isArray(j)){ GIFTS = j.filter(function(g){ return g && g.t === 'gift'; }).map(cleanGift); okOnce = true; } }).catch(function(){}).then(end); }
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
   هذا الجزء ينسخ CSS المنشور من الرئيسية (المصدر الوحيد: سجل CSS في محرر الثيم) ويضيفه للصفحة إن كان ناقصاً. يُحفظ في المتصفح ساعة. */
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
/* ============================================================
   MN-RAMADAN-COUNTDOWN — عداد رمضان 1448 (منارات فقط). أُضيف 2026-11-10.
   - الرئيسية: عداد كبير تحت السلايدر.
   - صفحات المشاريع: شريط رفيع في نهاية صفحة المشروع، بعد قسم المشروع وقبل الفوتر، وزره ينقل إلى «جاهز لرمضان».
     في صفحة «جاهز لرمضان» نفسها يُخفى الزر.
   - أبيض من شروق الشمس إلى غروبها في مكة، وكحلي في الليل.
   - زر «مشاركة» في عداد الرئيسية فقط، والرابط المُرسل يفتح الرئيسية وينزل إلى العداد (#ramadan).
   - يختفي تلقائياً مع دخول رمضان (8 فبراير 2027، 00:00 بتوقيت السعودية).
   - تعديل 2026-11-10 بعد التجربة الحية: (1) المحدِّد productBefore صار #nt_footer لأن شريط التواصل غير موجود في المتجر الحي،
     (2) الشاشات الكبيرة: النص والأرقام متجاوران في الوسط بدل الحافتين، (3) العرض 1366 ليطابق بطاقات الفرص.
   ============================================================ */
(function(){
  'use strict';
  if (window.__mnRamadanCountdown) return; window.__mnRamadanCountdown = 1;

  var CFG = {
    target: Date.UTC(2027, 1, 7, 21, 0, 0),      /* 1 رمضان 1448 = الاثنين 8 فبراير 2027، 00:00 بتوقيت السعودية */
    link: '/products/ramadan-ready',
    homeAfter: '.type_slideshow',                 /* العداد الكبير يُدرج بعد هذا العنصر في الرئيسية */
    productBefore: '#nt_footer',                  /* الشريط يُدرج قبل الفوتر، أي بعد قسم المشروع */
    skipPaths: ['/cart','/checkout','/payment','/thank','/orders','/account','/auth']
  };
  if (Date.now() >= CFG.target) return;

  var path = location.pathname.replace(/\/+$/,'') || '/';
  if (CFG.skipPaths.some(function(s){ return path.indexOf(s) === 0; })) return;
  var isHome = path === '/';
  var isProduct = /^\/products\/[^\/]+$/.test(path);
  if (!isHome && !isProduct) return;
  var isRamadanProject = path === CFG.link;

  var CSS = ".mn-rc{--navy:#052560;--teal:#00b5a7;--teal-dark:#008F85;--mint:#EAF8F7;--mint-line:#CFEDEA;--ink:#0F1F19;--muted:#4B5B54;--font:\"Almarai\",\"Tajawal\",\"Segoe UI\",Tahoma,sans-serif;container-type:inline-size;font-family:var(--font);direction:rtl;line-height:1.7}.mn-rc *{box-sizing:border-box}.mn-rc-box{position:relative;overflow:hidden;border-radius:18px;padding:30px 34px;display:grid;grid-template-columns:auto auto;justify-content:center;align-items:center;gap:22px clamp(48px,9cqi,120px)}.mn-rc-moon{position:absolute;inset-inline-end:-40px;top:-50px;width:230px;height:230px;opacity:.12;pointer-events:none}.mn-rc-text,.mn-rc-side{position:relative}.mn-rc-eyebrow{font-size:.9rem;font-weight:700;margin:0 0 4px}.mn-rc-title{font-size:clamp(1.5rem,3.2cqi,2.1rem);font-weight:800;line-height:1.3;margin:0 0 6px}.mn-rc-sub{margin:0 0 16px;font-size:1rem;line-height:1.7;max-width:46ch}.mn-rc-dates{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 4px;padding:0;list-style:none}.mn-rc-dates li{border-radius:30px;padding:5px 14px;font-size:.88rem;font-weight:700}.mn-rc-hint{font-size:.78rem;margin:8px 0 0}.mn-rc-side{display:flex;flex-direction:column;gap:14px;align-items:stretch}.mn-rc-tiles{display:grid;grid-template-columns:repeat(4,minmax(74px,1fr));gap:10px}.mn-rc-tile{border-radius:14px;padding:12px 6px 10px;text-align:center}.mn-rc-num{display:block;font-size:clamp(1.7rem,4.2cqi,2.6rem);font-weight:800;line-height:1.15;font-variant-numeric:tabular-nums;direction:ltr}.mn-rc-lbl{display:block;font-size:.85rem;font-weight:700;margin-top:2px}.mn-rc-cta{display:flex;align-items:center;justify-content:center;min-height:50px;border-radius:30px;padding:0 26px;font-size:1.05rem;font-weight:700;text-decoration:none;white-space:nowrap;transition:background .2s,color .2s}.mn-rc-cta:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.mn-rc--navy .mn-rc-box{background:var(--navy)}.mn-rc--navy .mn-rc-moon{color:var(--teal)}.mn-rc--navy .mn-rc-eyebrow{color:var(--teal)}.mn-rc--navy .mn-rc-title{color:#fff}.mn-rc--navy .mn-rc-sub{color:#E3E9F5}.mn-rc--navy .mn-rc-hint{color:#C3CEE4}.mn-rc--navy .mn-rc-dates li{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff}.mn-rc--navy .mn-rc-tile{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18)}.mn-rc--navy .mn-rc-num{color:#fff}.mn-rc--navy .mn-rc-lbl{color:var(--teal)}.mn-rc--navy .mn-rc-cta{background:var(--teal);color:var(--navy)}.mn-rc--navy .mn-rc-cta:hover{background:#fff;color:var(--navy)}.mn-rc--white .mn-rc-box{background:#fff;border:1.5px solid var(--mint-line)}.mn-rc--white .mn-rc-moon{color:var(--teal);opacity:.14}.mn-rc--white .mn-rc-eyebrow{color:var(--teal-dark)}.mn-rc--white .mn-rc-title{color:var(--navy)}.mn-rc--white .mn-rc-sub{color:var(--ink)}.mn-rc--white .mn-rc-hint{color:var(--muted)}.mn-rc--white .mn-rc-dates li{background:var(--mint);border:1px solid var(--mint-line);color:var(--navy)}.mn-rc--white .mn-rc-tile{background:var(--navy)}.mn-rc--white .mn-rc-num{color:#fff}.mn-rc--white .mn-rc-lbl{color:#7FE3DB}.mn-rc--white .mn-rc-cta{background:var(--navy);color:#fff}.mn-rc--white .mn-rc-cta:hover{background:var(--teal-dark);color:#fff}.mn-rc--bar .mn-rc-box{background:var(--navy);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:14px 22px;gap:12px 48px}.mn-rc--bar .mn-rc-moon{position:static;width:30px;height:30px;opacity:1;color:var(--teal);flex:0 0 30px}.mn-rc--bar .mn-rc-text{flex:0 1 auto}.mn-rc--bar .mn-rc-title{color:#fff;font-size:1.2rem;margin:0}.mn-rc--bar .mn-rc-eyebrow,.mn-rc--bar .mn-rc-sub,.mn-rc--bar .mn-rc-dates,.mn-rc--bar .mn-rc-hint{display:none}.mn-rc--bar .mn-rc-side{flex-direction:row;align-items:center;gap:16px}.mn-rc--bar .mn-rc-tiles{display:flex;gap:8px}.mn-rc--bar .mn-rc-tile{display:flex;align-items:baseline;gap:5px;padding:5px 12px;border-radius:30px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2)}.mn-rc--bar .mn-rc-num{font-size:1.25rem;color:#fff}.mn-rc--bar .mn-rc-lbl{font-size:.8rem;margin:0;color:var(--teal)}.mn-rc--bar .mn-rc-cta{min-height:42px;font-size:.95rem;padding:0 20px;background:var(--teal);color:var(--navy)}.mn-rc--bar .mn-rc-cta:hover{background:#fff;color:var(--navy)}.mn-rc--bar.mn-rc--white .mn-rc-box{background:#fff;border:1.5px solid var(--mint-line)}.mn-rc--bar.mn-rc--white .mn-rc-moon{color:var(--teal-dark);opacity:1}.mn-rc--bar.mn-rc--white .mn-rc-title{color:var(--navy)}.mn-rc--bar.mn-rc--white .mn-rc-tile{background:var(--mint);border:1px solid var(--mint-line)}.mn-rc--bar.mn-rc--white .mn-rc-num{color:var(--navy)}.mn-rc--bar.mn-rc--white .mn-rc-lbl{color:var(--teal-dark)}.mn-rc--bar.mn-rc--white .mn-rc-cta{background:var(--navy)}.mn-rc--bar.mn-rc--white .mn-rc-cta:hover{background:var(--teal-dark)}.mn-rc-actions{display:flex;gap:8px;align-items:stretch}.mn-rc-actions .mn-rc-cta{flex:1 1 auto}.mn-rc .mn-rc-share{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:50px;width:auto;min-width:0;margin:0;padding:0 18px!important;border-radius:30px!important;border:1.5px solid currentColor!important;background:transparent!important;box-shadow:none!important;font-family:inherit;font-size:.95rem!important;font-weight:700!important;line-height:1;cursor:pointer}.mn-rc-share svg{width:18px;height:18px;flex:0 0 18px}.mn-rc.mn-rc--navy .mn-rc-share{color:#fff!important}.mn-rc.mn-rc--white .mn-rc-share{color:#052560!important}.mn-rc-menu{display:none;gap:8px}.mn-rc-menu.is-open{display:flex}.mn-rc .mn-rc-menu a,.mn-rc .mn-rc-menu button{flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;min-height:40px;width:auto;min-width:0;margin:0;padding:0 12px!important;border-radius:30px!important;box-shadow:none!important;font-family:inherit;font-size:.88rem!important;font-weight:700!important;line-height:1;text-decoration:none!important;white-space:nowrap;cursor:pointer}.mn-rc.mn-rc--navy .mn-rc-menu a,.mn-rc.mn-rc--navy .mn-rc-menu button{background:rgba(255,255,255,.12)!important;border:1px solid rgba(255,255,255,.25)!important;color:#fff!important}.mn-rc.mn-rc--white .mn-rc-menu a,.mn-rc.mn-rc--white .mn-rc-menu button{background:#EAF8F7!important;border:1px solid #CFEDEA!important;color:#052560!important}.mn-rc-share:focus-visible,.mn-rc-menu a:focus-visible,.mn-rc-menu button:focus-visible{outline:3px solid var(--teal);outline-offset:2px}.mn-rc--bar .mn-rc-share,.mn-rc--bar .mn-rc-menu{display:none!important}.mn-rc .mn-rc-cta,.mn-rc .mn-rc-cta:hover{text-decoration:none!important}.mn-rc.mn-rc--navy .mn-rc-cta,.mn-rc.mn-rc--navy .mn-rc-cta:hover{color:#052560!important}.mn-rc.mn-rc--white .mn-rc-cta,.mn-rc.mn-rc--white .mn-rc-cta:hover{color:#fff!important}.mn-rc .mn-rc-dates,.mn-rc .mn-rc-dates li{list-style:none!important}.mn-rc .mn-rc-dates li{margin:0}.mn-rc--no-cta .mn-rc-cta{display:none!important}@container (max-width:760px){.mn-rc-box{grid-template-columns:1fr;padding:24px 18px;text-align:center}.mn-rc-sub{margin-inline:auto}.mn-rc-dates{justify-content:center}.mn-rc-tiles{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.mn-rc-moon{width:170px;height:170px}.mn-rc--bar .mn-rc-box{justify-content:center;padding:16px 14px}.mn-rc--bar .mn-rc-moon{display:none}.mn-rc--bar .mn-rc-text{flex:1 1 100%}.mn-rc--bar .mn-rc-side{flex-direction:column;width:100%;gap:12px}.mn-rc--bar .mn-rc-tiles{justify-content:center;flex-wrap:wrap;gap:6px}.mn-rc--bar .mn-rc-tile{padding:4px 9px}.mn-rc--bar .mn-rc-num{font-size:1.1rem}.mn-rc--bar .mn-rc-cta{width:100%}.mn-rc--bar .mn-rc-actions{width:100%}}@container (max-width:520px){.mn-rc-box{padding:16px 14px;gap:12px}.mn-rc-eyebrow{display:none}.mn-rc-sub{font-size:.85rem;line-height:1.5;margin:0 auto 8px}.mn-rc-hint{font-size:.7rem;line-height:1.5;margin:6px 0 0}.mn-rc-title{font-size:1.25rem;margin:0 0 8px}.mn-rc-dates{gap:6px;margin:0}.mn-rc-dates li{padding:2px 10px;font-size:.78rem}.mn-rc-side{gap:10px}.mn-rc-tile{padding:7px 4px 6px;border-radius:12px}.mn-rc-num{font-size:1.45rem}.mn-rc-lbl{font-size:.75rem;margin:0}.mn-rc-cta{min-height:42px;font-size:.95rem}.mn-rc .mn-rc-share{min-height:42px;padding:0 12px!important;font-size:.88rem!important}.mn-rc-cta{padding:0 14px}.mn-rc-moon{width:120px;height:120px;top:-30px;inset-inline-end:-30px}.mn-rc--bar .mn-rc-box{padding:12px;gap:8px}.mn-rc--bar .mn-rc-title{font-size:1rem;margin:0}.mn-rc--bar .mn-rc-side{gap:8px}.mn-rc--bar .mn-rc-tiles{flex-wrap:nowrap;gap:5px}.mn-rc--bar .mn-rc-tile{padding:2px 8px;gap:4px}.mn-rc--bar .mn-rc-num{font-size:1rem}.mn-rc--bar .mn-rc-lbl{font-size:.72rem}.mn-rc--bar .mn-rc-cta{min-height:36px;font-size:.88rem}}@media (prefers-reduced-motion:reduce){.mn-rc-cta{transition:none}}";
  var MOON = '<svg class="mn-rc-moon" viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M78 62A38 38 0 1 1 38 22a30 30 0 0 0 40 40z"/></svg>';

  function tile(key, label){
    return '<div class="mn-rc-tile"><span class="mn-rc-num" data-k="'+key+'">0</span><span class="mn-rc-lbl">'+label+'</span></div>';
  }
  function html(){
    /* العنوان div وليس h2 حتى لا يأخذ لون وحجم عناوين المتجر */
    return '<div class="mn-rc-box">'+MOON+
      '<div class="mn-rc-text">'+
        '<p class="mn-rc-eyebrow">رمضان 1448 هـ</p>'+
        '<div class="mn-rc-title" role="heading" aria-level="2">كم باقي على رمضان؟</div>'+
        '<p class="mn-rc-sub">شارك في تجهيز مساجد مكة قبل دخول الشهر الكريم.</p>'+
        '<ul class="mn-rc-dates"><li>الاثنين 8 فبراير 2027</li><li>1 رمضان 1448 هـ</li></ul>'+
        '<p class="mn-rc-hint">حسب تقويم أم القرى، وقد يتغير يوماً واحداً حسب رؤية الهلال.</p>'+
      '</div>'+
      '<div class="mn-rc-side">'+
        '<div class="mn-rc-tiles" role="timer" aria-label="الوقت الباقي على رمضان">'+
          tile('d','يوم')+tile('h','ساعة')+tile('m','دقيقة')+tile('s','ثانية')+
        '</div>'+
        '<div class="mn-rc-actions">'+
          '<a class="mn-rc-cta" href="'+CFG.link+'">تبرع لمشروع جاهز لرمضان</a>'+
          '<button type="button" class="mn-rc-share" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg><span>مشاركة</span></button>'+
        '</div>'+
        '<div class="mn-rc-menu"><a class="mn-rc-wa" href="#" target="_blank" rel="noopener">واتساب</a><button type="button" class="mn-rc-copy">نسخ الرابط</button></div>'+
      '</div>'+
    '</div>';
  }

  /* زر المشاركة: في الجوال يفتح قائمة المشاركة في الجهاز، وفي الحاسوب يُظهر «واتساب» و«نسخ الرابط» */
  function bindShare(host, url, target){
    var btn = host.querySelector('.mn-rc-share'), menu = host.querySelector('.mn-rc-menu'), wa = host.querySelector('.mn-rc-wa'), cp = host.querySelector('.mn-rc-copy');
    if (!btn || !menu || !wa || !cp) return;
    function text(){ return 'كم باقي على رمضان ؟'; }
    function show(on){ menu.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', on ? 'true' : 'false'); if (on) wa.href = 'https://wa.me/?text=' + encodeURIComponent(text() + '\n' + url); }
    btn.addEventListener('click', function(){
      if (menu.classList.contains('is-open')) { show(false); return; }
      var mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (mobile && navigator.share){
        navigator.share({ title: 'كم باقي على رمضان؟', text: text(), url: url }).catch(function(e){ if (!e || e.name !== 'AbortError') show(true); });
      } else show(true);
    });
    cp.addEventListener('click', function(){
      function done(){ cp.textContent = 'تم نسخ الرابط'; setTimeout(function(){ cp.textContent = 'نسخ الرابط'; }, 2000); }
      function fallback(){ try { var t = document.createElement('textarea'); t.value = url; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); done(); } catch(e){ cp.textContent = url; } }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fallback); else fallback();
    });
  }

  /* شروق وغروب مكة لكل يوم، بتوقيت السعودية مهما كان بلد الزائر */
  function isDay(){
    var ksa = new Date(Date.now() + 3 * 3600000);
    var N = Math.floor((Date.UTC(ksa.getUTCFullYear(), ksa.getUTCMonth(), ksa.getUTCDate()) - Date.UTC(ksa.getUTCFullYear(), 0, 0)) / 86400000);
    var g = 2 * Math.PI / 365 * (N - 1);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var lat = 21.4225 * Math.PI / 180, lon = 39.8262;
    var ha = Math.acos(Math.cos(90.833 * Math.PI / 180) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec)) * 180 / Math.PI;
    var rise = 720 - 4 * (lon + ha) - eq + 180, set = 720 - 4 * (lon - ha) - eq + 180;
    var now = ksa.getUTCHours() * 60 + ksa.getUTCMinutes();
    return now >= rise && now < set;
  }

  var wrap, host, timer, themeTimer;
  function theme(){
    var day = true; try { day = isDay(); } catch(e){}
    host.classList.toggle('mn-rc--white', day);
    host.classList.toggle('mn-rc--navy', !day);
  }
  function pad(n){ return n < 10 ? '0' + n : String(n); }
  function tick(){
    var left = CFG.target - Date.now();
    if (left <= 0){ clearInterval(timer); clearInterval(themeTimer); if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); return; }
    var s = Math.floor(left / 1000);
    var v = { d: String(Math.floor(s / 86400)), h: pad(Math.floor(s % 86400 / 3600)), m: pad(Math.floor(s % 3600 / 60)), s: pad(s % 60) };
    var nums = host.querySelectorAll('[data-k]');
    for (var i = 0; i < nums.length; i++) nums[i].textContent = v[nums[i].getAttribute('data-k')];
  }
  function mount(){
    if (document.getElementById('mn-rc-wrap')) return true;
    var ref = document.querySelector(isHome ? CFG.homeAfter : CFG.productBefore);
    if (!ref || !ref.parentNode) return false;
    if (!document.getElementById('mn-rc-style')){
      var st = document.createElement('style'); st.id = 'mn-rc-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    wrap = document.createElement('div'); wrap.id = 'mn-rc-wrap';
    wrap.style.cssText = 'max-width:1366px;margin:' + (isHome ? '24px' : '8px') + ' auto ' + (isHome ? '8px' : '28px') + ';padding:0 15px;box-sizing:border-box;clear:both';
    host = document.createElement('div');
    host.className = 'mn-rc' + (isHome ? '' : ' mn-rc--bar') + (isRamadanProject ? ' mn-rc--no-cta' : '');
    host.innerHTML = html();
    wrap.appendChild(host);
    if (isHome) ref.parentNode.insertBefore(wrap, ref.nextSibling); else ref.parentNode.insertBefore(wrap, ref);
    theme(); tick();
    if (isHome){
      bindShare(host, location.origin + '/#ramadan', CFG.target);
      /* رابط المشاركة ينتهي بـ #ramadan: ننزل بالزائر إلى العداد مباشرة */
      if (location.hash === '#ramadan') setTimeout(function(){ try { wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){ wrap.scrollIntoView(); } }, 400);
    }
    timer = setInterval(tick, 1000);
    themeTimer = setInterval(theme, 60000);
    return true;
  }
  function start(){
    var tries = 0;
    (function attempt(){ try { if (mount()) return; } catch(e){ return; } if (++tries < 20) setTimeout(attempt, 500); })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* ============================================================
   MN-TEXT-FIX — يصحح همزات وإملاء نصوص الثيم بعد تحميل الصفحة
   يبدّل النص الكامل فقط إذا طابق النص الخاطئ تماماً (بعد حذف المسافات حوله).
   لا يلمس نصوص المتبرعين ولا الأوصاف. يراقب الصفحة 30 ثانية ثم يتوقف.
   الإيقاف السريع: احذف هذا الجزء.
   ============================================================ */
(function(){
  try {
    var MAP = {
      'تبرع الان': 'تبرع الآن',
      'ادخل مبلغ آخر': 'أدخل مبلغاً آخر',
      'اضف تقييم': 'أضف تقييماً',
      'ارسل تعلقيك': 'أرسل تعليقك',
      'اجمالي التبرعات': 'إجمالي التبرعات',
      'السلة فارغه!': 'السلة فارغة!',
      'الاكثر تداولاً': 'الأكثر تداولاً',
      'اغلاق': 'إغلاق'
    };
    var ATTRS = ['placeholder', 'aria-label', 'title'];
    var SEL = 'a,button,span,label,h1,h2,h3,h4,h5,h6,nav,li,input,textarea';
    function trim(s){ return s.replace(/^\s+|\s+$/g, ''); }
    function norm(s){ return trim(s).replace(/\s+/g, ' '); }
    function fixNode(el){
      try {
        for (var a = 0; a < ATTRS.length; a++) {
          var v = el.getAttribute && el.getAttribute(ATTRS[a]);
          if (v) {
            var vk = norm(v);
            if (MAP.hasOwnProperty(vk)) el.setAttribute(ATTRS[a], MAP[vk]);
          }
        }
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        for (var n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType !== 3) continue;
          var raw = trim(n.nodeValue);
          var k = raw.replace(/\s+/g, ' ');
          if (k && MAP.hasOwnProperty(k)) n.nodeValue = n.nodeValue.replace(raw, MAP[k]);
        }
      } catch (e) {}
    }
    function run(){
      try {
        var list = document.querySelectorAll(SEL);
        for (var i = 0; i < list.length; i++) fixNode(list[i]);
      } catch (e) {}
    }
    var pending = false;
    function schedule(){
      if (pending) return;
      pending = true;
      setTimeout(function(){ pending = false; run(); }, 60);
    }
    function begin(){
      run();
      if (typeof MutationObserver === 'undefined') {
        var c = 0, iv = setInterval(function(){ run(); if (++c >= 30) clearInterval(iv); }, 1000);
        return;
      }
      var mo = new MutationObserver(schedule);
      mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title'] });
      setTimeout(function(){ try { mo.disconnect(); } catch (e) {} run(); }, 30000);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin); else begin();
  } catch (e) {}
})();

/* ============================================================
   MN-GIFT-LOADER — يحمّل gift.js («🎁 أهدِ من تحب») من نفس رقم الـcommit
   الإيقاف السريع: احذف هذا الجزء، أو ضع KILL=1 في شيت «إهداءات منارات».
   ============================================================ */
(function(){
  try {
    if (document.getElementById('mn-gift-js')) return;
    var me = document.currentScript && document.currentScript.src;
    if (!me) { var s = document.querySelector('script[src*="manarat-widgets/"][src*="manarat-widgets.js"]') || document.querySelector('script[src*="manarat-widgets.js"]'); me = s && s.src; }
    if (!me || me.indexOf('manarat-widgets.js') < 0) return;
    var g = document.createElement('script');
    g.id = 'mn-gift-js'; g.defer = true;
    g.src = me.replace(/manarat-widgets\.js(\?.*)?$/, 'gift.js');
    (document.head || document.documentElement).appendChild(g);
  } catch (e) {}
})();
/* ============================================================
   MN-WA-FIX — زر واتساب العائم في الثيم: 0555438678 ← 966555438678
   ============================================================ */
(function(){
  try {
    function fixWa(){
      try {
        var els = document.querySelectorAll('.whatsappWrapper a[href], a[href*="whatsapp.com/send"], a[href*="wa.me/"]');
        for (var i = 0; i < els.length; i++) {
          var h = els[i].getAttribute('href') || '';
          if (/phone=0(5\d{8})(?!\d)/.test(h)) els[i].setAttribute('href', h.replace(/phone=0(5\d{8})(?!\d)/, 'phone=966$1'));
        }
      } catch (e) {}
    }
    fixWa();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixWa);
    window.addEventListener('load', fixWa);
    setTimeout(fixWa, 2000); setTimeout(fixWa, 5000);
  } catch (e) {}
})();
