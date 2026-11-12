/* ============================================================
   gift.js — «🎁 أهدِ من تحب» — جمعية منارات مكة (متجر زد mmcm.sa، 3264753)
   v1 — 2026-11-12
   يُحمَّل من manarat-widgets.js من نفس رقم الـcommit (لا @main).
   يعمل في:
     1) صفحة المشروع  /products/<slug>        زر + لوحة الإهداء (و #hadiya-open ينزل إلى الزر واللوحة مغلقة)
     2) بطاقات المشاريع (الرئيسية و /products)  سطر «🎁 أهدِ من تحب» تحت «تبرع الآن»
     3) صفحة الشكر    /order-completed/<رمز>/invoice و /orders/<رمز>/invoice  ← «أكمل هديتك»
        وأي صفحة + #hadiya-complete
     4) أي صفحة + #hadiya=<الرمز>  ← صفحة المُهدى إليه
   القواعد: رمز الطلب لا يُرسل إلا إلى سكربت الجمعية ولا يوضع في أي رابط إهداء.
            لا جوال ولا بريد. النصوص بـ textContent. الأسماء لا تظهر في عنوان الصفحة.
   ============================================================ */
(function () {
  'use strict';
  if (window.__mnGift) return; window.__mnGift = 1;

  /* ===================== الإعدادات ===================== */
  var API = 'https://script.google.com/macros/s/AKfycbzhHWK26ak8ucCVJDBRm8XSMSBSXGg5GAzFPwDt5mvDk8lPJcG9djh4_72PKwtqZI11tA/exec';
  var SITE = 'https://mmcm.sa';
  var NAVY = '#052560', TEAL = '#00b5a7', TEALD = '#008F85';

  var PROJECTS = {
    'mobile-musalla': 'المصلّى المتنقّل', 'water': 'سقيا المساجد', 'taqwa-trio': 'ثلاثية التقوى',
    'perfume': 'تطييب المساجد', 'full-care': 'العناية الشاملة بالمساجد', 'carpet': 'فرش المساجد',
    'ramadan-ready': 'تهيئة المساجد لرمضان', 'daily-blessing': 'بركتك اليومية'
  };

  /* المناسبات: الترتيب يطابق OCC في سكربت الجمعية حرفيًا. d = التصميم المقترح */
  var OCC = [
    {g:0, l:'إهداء عام', m:'جعله الله في ميزان حسناتك', f:'جعله الله في ميزان حسناتكِ', d:0},
    {g:0, l:'مولود جديد', m:'بارك الله لكم في الموهوب، وجعله من الصالحين', d:1},
    {g:0, l:'زواج', m:'بارك الله لكما وبارك عليكما وجمع بينكما في خير', d:2},
    {g:0, l:'تخرّج', m:'مبارك تخرّجك، وجعل الله علمك نافعًا', f:'مبارك تخرّجكِ، وجعل الله علمكِ نافعًا', d:3},
    {g:0, l:'نجاح وتفوّق', m:'مبارك نجاحك، وزادك الله توفيقًا', f:'مبارك نجاحكِ، وزادكِ الله توفيقًا', d:3},
    {g:0, l:'وظيفة أو ترقية', m:'وفّقك الله، وبارك لك في رزقك', f:'وفّقكِ الله، وبارك لكِ في رزقكِ', d:12},
    {g:0, l:'منزل جديد', m:'بارك الله لك في دارك، وجعلها عامرة بذكره', f:'بارك الله لكِ في داركِ، وجعلها عامرة بذكره', d:4},
    {g:0, l:'ختم القرآن', m:'جعل الله القرآن ربيع قلبك ونور صدرك', f:'جعل الله القرآن ربيع قلبكِ ونور صدركِ', d:5},
    {g:0, l:'شكر وتقدير', m:'جزاك الله خيرًا، وشكر لك فضلك', f:'جزاكِ الله خيرًا، وشكر لكِ فضلكِ', d:12},
    {g:1, l:'رمضان', m:'بلّغك الله رمضان، وتقبّل منك صيامك وقيامك', f:'بلّغكِ الله رمضان، وتقبّل منكِ صيامكِ وقيامكِ', d:6},
    {g:1, l:'عيد الفطر', m:'تقبّل الله منا ومنكم، وعيدكم مبارك', d:7},
    {g:1, l:'عيد الأضحى', m:'تقبّل الله منا ومنكم، وكل عام وأنتم بخير', d:7},
    {g:1, l:'عشر ذي الحجة', m:'تقبّل الله منك في خير أيام الدنيا', f:'تقبّل الله منكِ في خير أيام الدنيا', d:8},
    {g:1, l:'حج أو عمرة', m:'تقبّل الله منك، حجًّا مبرورًا وسعيًا مشكورًا', f:'تقبّل الله منكِ، حجًّا مبرورًا وسعيًا مشكورًا', d:8},
    {g:2, l:'لوالديّ (أحياء)', m:'برًّا بك، ونسأل الله أن يجزيك عنّا خير الجزاء', f:'برًّا بكِ، ونسأل الله أن يجزيكِ عنّا خير الجزاء', d:13},
    {g:2, l:'صدقة عن متوفى', dead:1, m:'رحمه الله، وجعلها في ميزان حسناته', f:'رحمها الله، وجعلها في ميزان حسناتها', d:9},
    {g:2, l:'دعاء بالشفاء', m:'نسأل الله أن يشفيك شفاءً لا يغادر سقمًا', f:'نسأل الله أن يشفيكِ شفاءً لا يغادر سقمًا', d:10},
    {g:0, l:'سلامة وشفاء', m:'الحمد لله على سلامتك، وألبسك الله ثوب الصحة والعافية', f:'الحمد لله على سلامتكِ، وألبسكِ الله ثوب الصحة والعافية', d:10}
  ];
  var GROUPS = ['أفراح', 'مواسم', 'دعاء وصدقة'];
  /* التصاميم: الترتيب يطابق DK في السكربت */
  var DS = [['general','عام'],['boy','مولود'],['wedding','زواج'],['grad','تخرّج'],['home','منزل'],['quran','مصحف'],
    ['ramadan','رمضان'],['eid','عيد'],['hajj','حج'],['calm','هادئ'],['heal','شفاء'],['girl','مولودة'],['thanks','شكر'],['parents','والدان']];
  var TOPO = [0, 14, 15, 9], TOPD = [0, 9, 6];
  var NS = [5.03, 6.18, 7.09];                 // حجم الاسم بوحدة cqw (صغير/متوسط/كبير)
  var FEM_RX = /^(أم |ام |والدتي|أمي|امي|زوجتي|أختي|اختي|ابنتي|بنتي|جدتي|خالتي|عمتي)/;
  var KEEP_MS = 48 * 3600e3;                   // مدة حفظ اختيارات البطاقة قبل الدفع

  /* أصل الملفات: نفس commit الملف الذي حمّلنا */
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    if (!s) { var el = document.querySelector('script[src*="manarat-widgets"][src*="gift.js"]'); s = el && el.src; }
    return s ? s.replace(/gift\.js(\?.*)?$/, '') : 'https://cdn.jsdelivr.net/gh/Mnarat/manarat-widgets@main/';
  })();
  function toEn(v) { return String(v || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }).replace(/[^0-9.]/g, ''); }
  function hasP(k) { return !!k && Object.prototype.hasOwnProperty.call(PROJECTS, k); }
  function img(d, th) { return BASE + 'img/gift/' + DS[d][0] + '-' + (th ? 'l' : 'd') + '.jpg'; }

  /* ===================== أدوات ===================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function ls(k, v) {
    try {
      if (v === undefined) { var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function dev() {
    var d = ls('mn_dev');
    if (!d) { d = ''; for (var i = 0; i < 16; i++) d += 'abcdefghijkmnpqrstuvwxyz23456789'.charAt(Math.floor(Math.random() * 32)); ls('mn_dev', d); }
    return d;
  }
  function cleanName(v) {
    v = String(v || '').replace(/[ً-ٟـٰ]/g, '').replace(/[^ء-غف-يa-zA-Z ]/g, '');
    return v.replace(/\s+/g, ' ').trim().slice(0, 25);
  }
  function isMobile() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }
  function post(body) {
    return fetch(API, {method:'POST', body:JSON.stringify(body), redirect:'follow'})
      .then(function (r) { return r.json(); });
  }
  var sentEv = {};
  function ev(name) {
    if (sentEv[name]) return; sentEv[name] = 1;
    try { fetch(API, {method:'POST', body:JSON.stringify({a:'ev', e:name, dev:dev()}), keepalive:true}).catch(function () {}); } catch (e) {}
  }
  function splitDua(m) {
    if (m.indexOf('، ') > 0) return m.replace('، ', '\n');
    if (m.length < 26) return m;
    var w = m.split(' '), half = m.length / 2, c = 0, i = 0;
    for (; i < w.length; i++) { c += w[i].length + 1; if (c >= half) break; }
    return w.slice(0, i + 1).join(' ') + '\n' + w.slice(i + 1).join(' ');
  }
  function dua(st) { var o = OCC[st.o]; return (st.fem && o.f) ? o.f : o.m; }
  function link(code) { return SITE + '/#hadiya=' + code; }

  /* ===================== التنسيق ===================== */
  var CSS = [
    '.mng *{box-sizing:border-box}',
    '.mng{font-family:"Almarai","Tajawal",Tahoma,sans-serif;direction:rtl;text-align:right;color:#1d2939;line-height:1.6}',
    '.mng-open{display:block;width:100%;margin-top:10px;font:700 15px/1.4 "Almarai",Tahoma,sans-serif;color:' + NAVY + ';background:#fff;border:1.5px solid ' + NAVY + ';border-radius:999px;padding:11px 14px;cursor:pointer;text-align:center;text-decoration:none}',
    '.mng-open:hover{background:#f2f5fb}',
    '.mng-cardlink{display:block;width:100%;margin-top:8px;font:800 15px/1.3 "Almarai",Tahoma,sans-serif;color:' + NAVY + '!important;background:#fff;border:1.5px solid ' + NAVY + ';border-radius:999px;padding:8px 10px;text-align:center;text-decoration:none!important}',
    '.mng-panel{border:1.5px solid ' + TEAL + ';border-radius:16px;padding:14px;margin-top:12px;background:#fbfefe}',
    '.mng-panel h4{margin:0 0 4px;color:' + NAVY + ';font-size:16px;font-weight:800}',
    '.mng label.mng-l{display:block;font-size:13px;color:#5b6b80;margin:12px 0 5px;font-weight:700}',
    '.mng-chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.mng-chip{font:inherit;font-size:13px;border:1px solid #CFEDEA;background:#fff;padding:6px 11px;border-radius:999px;cursor:pointer;color:' + NAVY + '}',
    '.mng-chip.on{background:#E0F5F3;border-color:' + TEAL + ';font-weight:700}',
    '.mng-chip.more{border-style:dashed;color:' + TEALD + ';font-weight:700}',
    '.mng-og{font-size:12px;color:' + TEALD + ';font-weight:700;margin:8px 0 4px}',
    '.mng-seg{display:flex;gap:6px}.mng-seg .mng-chip{flex:1;text-align:center}',
    '.mng-ds{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}',
    '.mng-sw{height:48px;border-radius:9px;cursor:pointer;border:2px solid transparent;background-size:cover;background-position:center;position:relative;padding:0}',
    '.mng-sw.on{border-color:' + TEAL + ';box-shadow:0 0 0 2px #fff inset}',
    '.mng-sw span{position:absolute;bottom:2px;left:0;right:0;text-align:center;font-size:10.5px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);pointer-events:none}',
    '.mng-sw.lt span{color:#1C2226;text-shadow:none}',
    '.mng-sw.more{background:#fff;border:1.5px dashed ' + TEAL + '}.mng-sw.more span{color:' + NAVY + ';text-shadow:none;bottom:14px}',
    '.mng input[type=text],.mng textarea,.mng select{width:100%;font:inherit;font-size:15px;padding:9px 11px;border:1px solid #d5dde6;border-radius:10px;background:#fff;color:#1d2939}',
    '.mng textarea{resize:vertical;font-size:14px}',
    '.mng input[inputmode=numeric]{width:100%!important;font:inherit!important;font-size:15px!important;padding:9px 11px!important;border:1px solid #d5dde6!important;border-radius:10px!important;background:#fff!important;color:#1d2939!important;height:auto!important;text-align:right!important}',
    '.mng input::placeholder,.mng textarea::placeholder{color:#98a2b3!important;opacity:1!important}',
    '.mng-chk{display:flex;gap:8px;align-items:center;font-size:13.5px;margin-top:8px;cursor:pointer}',
    '.mng-hint{font-size:12px;color:#5b6b80;margin-top:6px}',
    '.mng-lock{font-size:12.5px;background:#f8fafc;border:1px solid #eef1f4;border-radius:8px;padding:6px 9px;margin-top:5px}',
    '.mng-priv{font-size:12px;color:#5b6b80;background:#f8fafc;border-radius:8px;padding:7px 9px;margin-top:8px}',
    '.mng-err{color:#b42318;font-size:13px;margin-top:6px;display:none}',
    '.mng-btn{display:block;width:100%;font:700 15px/1.4 "Almarai",Tahoma,sans-serif;border:0;border-radius:999px;padding:12px;cursor:pointer;text-align:center;margin-top:10px;text-decoration:none}',
    '.mng-b1{background:' + TEAL + ';color:#fff}.mng-b2{background:#fff;color:' + NAVY + ';border:1.5px solid ' + NAVY + '}',
    '.mng-bw{background:#25D366;color:#073b1d}.mng-bs{background:#fff;color:#075E54;border:1.5px solid #25D366}',
    '.mng-btn[disabled]{opacity:.6;cursor:wait}',
    /* البطاقة */
    '.mng-card{position:relative;width:100%;aspect-ratio:1748/1240;border-radius:12px;overflow:hidden;container-type:inline-size;background-size:cover;background-position:center;background-color:#0A6A7B}',
    '.mng-card .in{position:absolute;left:21.5%;right:21.5%;top:15.5%;bottom:15.5%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}',
    '.mng-card .k1{font-size:1.95cqw;font-weight:700;display:flex;align-items:center;gap:1.1cqw}.mng-card .k1 i{width:3.9cqw;height:1px;background:currentColor;display:block}',
    '.mng-card .to{font-weight:800;line-height:1.2;margin:.9cqw 0}',
    '.mng-card .sep{width:12.6cqw;height:1.4cqw;margin-bottom:.4cqw}',
    '.mng-card .msg{font-family:Amiri,serif;font-size:3.2cqw;line-height:1.6;margin-top:1.1cqw;white-space:pre-line}',
    '.mng-card .opp{font-size:2.12cqw;font-weight:700;padding:1.15cqw 3cqw;border-radius:999px;margin-top:2cqw}',
    '.mng-card .from{font-size:2.12cqw;margin-top:1.8cqw}',
    '.mng-card .bar{position:absolute;top:0;left:0;right:0;background:rgba(5,37,96,.8);color:#fff;font-size:2.3cqw;font-weight:700;padding:.8cqw;text-align:center}',
    '.mng-card.d{color:#fff}.mng-card.d .k1{color:#EBD08C}.mng-card.d .to{text-shadow:0 .23cqw 1.8cqw rgba(0,15,30,.6)}.mng-card.d .msg{text-shadow:0 .1cqw 1.1cqw rgba(0,20,30,.55)}',
    '.mng-card.d .opp{background:rgba(3,18,44,.30);border:1px solid #D9B465}.mng-card.d .from{color:rgba(255,255,255,.92)}',
    '.mng-card.l{color:#1C2226}.mng-card.l .k1{color:#8A6420}.mng-card.l .opp{background:rgba(255,255,255,.65);border:1px solid #B08A3E}.mng-card.l .from{color:rgba(28,34,38,.85)}',
    /* النافذة */
    '.mng-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(5,20,45,.55);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 10px 40px}',
    '.mng-box{max-width:460px;margin:0 auto;background:#fff;border-radius:18px;padding:16px;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.25)}',
    '.mng-x{position:absolute;top:8px;left:10px;width:34px;height:34px;border:0;background:#f2f4f7;border-radius:50%;font-size:20px;line-height:34px;cursor:pointer;color:#344054;padding:0}',
    '.mng-box h3{margin:2px 0 10px;color:' + NAVY + ';font-size:18px;font-weight:800;text-align:center}',
    '.mng-res img{width:100%;border-radius:12px;display:block}',
    '.mng-small{font-size:11.5px;color:#667085;text-align:center;margin-top:10px}',
    '.mng-dua{text-align:center;color:' + NAVY + ';font-size:14.5px;margin-top:10px}',
    '.mng-msgbox{white-space:pre-wrap;background:#f8fafc;border:1px solid #eef1f4;border-radius:10px;padding:9px;font-size:13.5px;margin-top:8px}',
    '.mng-mhead{display:flex;align-items:baseline;justify-content:flex-start;gap:10px}.mng-mhead .mng-l{margin-bottom:5px}',
    '.mng button.mng-tog{font:700 12.5px "Almarai",Tahoma,sans-serif!important;color:'+TEALD+'!important;background:none!important;border:0!important;padding:12px 2px 5px!important;cursor:pointer;box-shadow:none!important;width:auto!important;min-height:0!important}',
    'button.mng-open.mng-pulse{animation-duration:.9s!important}',
    '@keyframes mngp{0%,100%{box-shadow:0 0 0 0 rgba(0,181,167,0)}50%{box-shadow:0 0 0 7px rgba(0,181,167,.38),0 0 18px rgba(0,181,167,.45)}}',
    'button.mng-open{animation:mngp 2.2s ease-in-out infinite}button.mng-open.on{animation:none}',
    '.mng label.mng-wal{color:#0B8F4D!important;font-size:14.5px!important;font-weight:800!important;background:#E7F8EE;border-radius:8px;padding:3px 9px;display:inline-block}',
    '.mng-spin{text-align:center;color:' + NAVY + ';padding:30px 0;font-size:15px}',
    /* ثيم إيثار يمسح حدود وخلفيات الأزرار: نثبّتها */
    'button.mng-open,a.mng-cardlink{border:1.5px solid ' + NAVY + '!important;background:#fff!important;color:' + NAVY + '!important;border-radius:999px!important}',
    'button.mng-open{padding:13px 14px!important;font-size:18px!important;font-weight:800!important;width:100%!important;min-height:44px}',
    '.mng button.mng-chip{border:1px solid #CFEDEA!important;background:#fff!important;color:' + NAVY + '!important;border-radius:999px!important;padding:6px 11px!important;font-size:13px!important;line-height:1.5!important;min-height:0!important;box-shadow:none!important}',
    '.mng button.mng-chip.on{background:#E0F5F3!important;border-color:' + TEAL + '!important}',
    '.mng button.mng-chip.more{border-style:dashed!important;color:' + TEALD + '!important}',
    '.mng button.mng-sw{border:2px solid transparent!important;border-radius:9px!important;padding:0!important;min-height:0!important;box-shadow:none!important}',
    '.mng button.mng-sw.on{border-color:' + TEAL + '!important;box-shadow:0 0 0 2px #fff inset!important}',
    '.mng button.mng-sw.more{background:#fff!important;border:1.5px dashed ' + TEAL + '!important}',
    '.mng .mng-btn{border-radius:999px!important;padding:12px!important;font-size:15px!important;box-shadow:none!important;width:100%!important}',
    '.mng .mng-b1{background:' + TEAL + '!important;color:#fff!important;border:0!important}',
    '.mng .mng-b2{background:#fff!important;color:' + NAVY + '!important;border:1.5px solid ' + NAVY + '!important}',
    '.mng .mng-bw{background:#25D366!important;color:#073b1d!important;border:0!important}',
    '.mng .mng-bs{background:#fff!important;color:#075E54!important;border:1.5px solid #25D366!important}',
    '.mng button.mng-x{background:#f2f4f7!important;border:0!important;border-radius:50%!important;padding:0!important;width:34px!important;height:34px!important}'
  ].join('\n');
  function style() {
    if ($('#mng-style')) return;
    var s = el('style'); s.id = 'mng-style'; s.textContent = CSS; document.head.appendChild(s);
    if (!$('#mng-amiri')) {
      var l = document.createElement('link'); l.id = 'mng-amiri'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
      document.head.appendChild(l);
    }
  }

  /* ===================== البطاقة (معاينة HTML فوق صورة معلَّمة) ===================== */
  function cardPreview(st, pName) {
    var o = OCC[st.o], L = st.th === 1, g = L ? '#8A6420' : '#EBD08C';
    var c = el('div', 'mng-card ' + (L ? 'l' : 'd'));
    c.style.backgroundImage = 'url("' + img(st.d, L) + '")';
    var inn = el('div', 'in');
    var k = el('div', 'k1'); k.appendChild(el('i')); k.appendChild(document.createTextNode(o.dead ? 'صدقة عن' : 'إهداء إلى')); k.appendChild(el('i'));
    var to = el('div', 'to', cleanName(st.to) || (o.dead ? 'اسم المتوفى' : 'من تحب')); to.style.fontSize = NS[st.ns] + 'cqw';
    var sep = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sep.setAttribute('class', 'sep'); sep.setAttribute('viewBox', '0 0 110 12');
    sep.innerHTML = '<path d="M0 6H44M66 6H110" stroke="' + g + '"/><circle cx="48" cy="6" r="1.6" fill="' + g + '"/><circle cx="62" cy="6" r="1.6" fill="' + g + '"/><path d="M55 0L61 6L55 12L49 6Z" fill="' + g + '"/>';
    inn.appendChild(k); inn.appendChild(to); inn.appendChild(sep);
    inn.appendChild(el('div', 'msg', splitDua(dua(st))));
    inn.appendChild(el('div', 'opp', '«' + pName + '» لمساجد مكة المكرمة'));
    inn.appendChild(el('div', 'from', (o.dead ? 'من: ' : 'مُهداة من: ') + fromName(st)));
    c.appendChild(inn);
    c.appendChild(el('div', 'bar', 'معاينة — تظهر البطاقة كاملة بعد إتمام التبرع'));
    return c;
  }
  function fromName(st) { return st.anon ? 'فاعل خير' : (cleanName(st.from) || 'اسمك'); }
  function autoMsg(st, pName) {
    var o = OCC[st.o], f = st.fem, F = fromName(st), T = cleanName(st.to) || 'من تحب';
    return o.dead ? 'تصدّق ' + F + ' عن ' + T + ' بـ«' + pName + '» لمساجد مكة، ' + (f ? 'رحمها' : 'رحمه') + ' الله'
                  : T + '، ' + (f ? 'أهداكِ ' : 'أهداك ') + F + ' أجر «' + pName + '» لمساجد مكة 🤍';
  }
  function linkLine(st, code) { return (st.fem ? 'بطاقتكِ' : 'بطاقتك') + ': ' + link(code || 'XXXXXXXX'); }
  function smsMsg(st, pName, code) {
    var o = OCC[st.o], F = fromName(st), T = cleanName(st.to);
    return (o.dead ? 'تصدّق ' + F + ' عن ' + T + ' عبر جمعية منارات مكة: '
                   : T + '، ' + (st.fem ? 'أهداكِ ' : 'أهداك ') + F + ' أجر «' + pName + '» عبر جمعية منارات مكة: ') + link(code);
  }

  /* ===================== نموذج الاختيارات (لوحة المشروع + أكمل هديتك) ===================== */
  /* st: {p,o,d,th,ns,fem,anon,from,to,msg,edited,dm}  opts: {pickProject, onChange} */
  function buildForm(host, st, opts) {
    opts = opts || {};
    var mo = 0, md = 0;
    host.innerHTML = '';
    var w = el('div');

    if (opts.pickProject) {
      w.appendChild(el('label', 'mng-l', 'المشروع الذي تبرعت فيه'));
      var sel = el('select'); sel.appendChild(new Option('اختر المشروع', ''));
      for (var s in PROJECTS) sel.appendChild(new Option(PROJECTS[s], s));
      sel.value = st.p || '';
      sel.onchange = function () { st.p = sel.value; refresh(); };
      w.appendChild(sel);
    }
    w.appendChild(el('label', 'mng-l', 'المناسبة'));
    var occBox = el('div'); w.appendChild(occBox);
    w.appendChild(el('label', 'mng-l', 'التصميم — أي تصميم مع أي مناسبة'));
    var dsBox = el('div', 'mng-ds'); w.appendChild(dsBox);
    w.appendChild(el('label', 'mng-l', 'ألوان البطاقة'));
    var thBox = el('div', 'mng-seg'); w.appendChild(thBox);
    w.appendChild(el('label', 'mng-l', 'حجم الاسم على البطاقة'));
    var nsBox = el('div', 'mng-seg'); w.appendChild(nsBox);

    w.appendChild(el('label', 'mng-l', 'اسمك'));
    var fIn = el('input'); fIn.type = 'text'; fIn.maxLength = 25; fIn.value = st.from || ''; fIn.placeholder = 'مثال: عبدالله';
    w.appendChild(fIn);
    var anL = el('label', 'mng-chk'), anIn = el('input'); anIn.type = 'checkbox'; anIn.checked = !!st.anon;
    anL.appendChild(anIn); anL.appendChild(document.createTextNode('أخفِ اسمي (يظهر «فاعل خير»)')); w.appendChild(anL);
    var tL = el('label', 'mng-l', 'اسم المُهدى إليه'); w.appendChild(tL);
    var tIn = el('input'); tIn.type = 'text'; tIn.maxLength = 25; tIn.value = st.to || ''; tIn.placeholder = 'مثال: أبو تميم';
    w.appendChild(tIn);
    var feL = el('label', 'mng-chk'), feIn = el('input'), feT = el('span'); feIn.type = 'checkbox'; feIn.checked = !!st.fem;
    feL.appendChild(feIn); feL.appendChild(feT); w.appendChild(feL);
    w.appendChild(el('div', 'mng-hint', 'الأسماء حروف فقط، بلا أرقام ولا روابط، حتى 25 حرفًا.'));
    w.appendChild(el('div', 'mng-priv', '🔒 الأسماء تظهر على البطاقة فقط، ولا تظهر في المتجر ولا في محركات البحث، وتُحذف بعد 90 يومًا. لا نطلب أي رقم جوال هنا.'));

    var mHead = el('div', 'mng-mhead'); mHead.appendChild(el('label', 'mng-l mng-wal', '💬 نص رسالة واتساب (يمكنك تعديله)'));
    var mTog = el('button', 'mng-tog', st.mOpen ? 'إخفاء ▴' : 'إظهار ▾'); mTog.type = 'button'; mHead.appendChild(mTog); w.appendChild(mHead);
    var mBox = el('div'); mBox.style.display = st.mOpen ? 'block' : 'none'; w.appendChild(mBox);
    var mIn = el('textarea'); mIn.rows = 3; mIn.maxLength = 300; mBox.appendChild(mIn);
    var mRow = el('div', 'mng-hint'); var mCnt = el('span'); var mRst = el('a', '', ' · إرجاع النص المقترح');
    mRst.href = 'javascript:void 0'; mRst.style.color = TEALD; mRow.appendChild(mCnt); mRow.appendChild(mRst); mBox.appendChild(mRow);
    var lkL = el('label', 'mng-chk'), lkIn = el('input'); lkIn.type = 'checkbox'; lkIn.checked = !st.noLink;
    lkL.appendChild(lkIn); lkL.appendChild(document.createTextNode('أضِف رابط البطاقة في آخر الرسالة')); mBox.appendChild(lkL);
    var lockL = el('div', 'mng-hint'); mBox.appendChild(lockL);
    var lkTxt = function () { lockL.textContent = st.noLink ? 'لن يُضاف الرابط للرسالة.' : 'سيُضاف رابط البطاقة في آخر الرسالة.'; };
    lkTxt(); lkIn.onchange = function () { st.noLink = !lkIn.checked; lkTxt(); };
    mTog.onclick = function () { st.mOpen = !st.mOpen; mBox.style.display = st.mOpen ? 'block' : 'none'; mTog.textContent = st.mOpen ? 'إخفاء ▴' : 'إظهار ▾'; };
    w.appendChild(el('label', 'mng-l', 'معاينة البطاقة'));
    var pv = el('div'); w.appendChild(pv);
    w.appendChild(el('div', 'mng-hint', 'كلمة «معاينة» داخل الصورة نفسها. البطاقة النظيفة تصنعها الجمعية بعد التأكد من الدفع.'));
    host.appendChild(w);

    function chip(txt, on, fn, cls) { var b = el('button', 'mng-chip' + (on ? ' on' : '') + (cls ? ' ' + cls : ''), txt); b.type = 'button'; b.onclick = fn; return b; }
    function refresh() {
      var pName = PROJECTS[st.p] || 'المشروع';
      occBox.innerHTML = '';
      if (!mo) {
        var row = el('div', 'mng-chips'), list = TOPO.slice(); if (list.indexOf(st.o) < 0) list.push(st.o);
        list.forEach(function (i) { row.appendChild(chip(OCC[i].l, i === st.o, function () { setOcc(i); })); });
        row.appendChild(chip('المزيد (' + OCC.length + ') ▾', 0, function () { mo = 1; refresh(); }, 'more'));
        occBox.appendChild(row);
      } else {
        GROUPS.forEach(function (gn, gi) {
          occBox.appendChild(el('div', 'mng-og', gn));
          var row = el('div', 'mng-chips');
          OCC.forEach(function (o, i) { if (o.g === gi) row.appendChild(chip(o.l, i === st.o, function () { setOcc(i); })); });
          occBox.appendChild(row);
        });
        var r2 = el('div', 'mng-chips'); r2.style.marginTop = '6px';
        r2.appendChild(chip('أقل ▴', 0, function () { mo = 0; refresh(); }, 'more')); occBox.appendChild(r2);
      }
      dsBox.innerHTML = '';
      var dl = md ? DS.map(function (_, i) { return i; }) : TOPD.slice(); if (!md && dl.indexOf(st.d) < 0) dl.push(st.d);
      dl.forEach(function (i) {
        var b = el('button', 'mng-sw' + (i === st.d ? ' on' : '') + (st.th ? ' lt' : '')); b.type = 'button';
        b.style.backgroundImage = 'url("' + img(i, st.th) + '")'; b.appendChild(el('span', '', DS[i][1]));
        b.onclick = function () { st.d = i; st.dm = 1; refresh(); }; dsBox.appendChild(b);
      });
      var mb = el('button', 'mng-sw more'); mb.type = 'button'; mb.appendChild(el('span', '', md ? 'أقل ▴' : 'المزيد (' + (DS.length - 3) + ')'));
      mb.onclick = function () { md = md ? 0 : 1; refresh(); }; dsBox.appendChild(mb);
      thBox.innerHTML = ''; ['غامقة', 'فاتحة'].forEach(function (t, i) { thBox.appendChild(chip(t, st.th === i, function () { st.th = i; refresh(); })); });
      nsBox.innerHTML = ''; ['صغير', 'متوسط', 'كبير'].forEach(function (t, i) { nsBox.appendChild(chip(t, st.ns === i, function () { st.ns = i; refresh(); })); });
      var dead = OCC[st.o].dead;
      tL.textContent = dead ? 'اسم المتوفى' : 'اسم المُهدى إليه';
      feT.textContent = dead ? 'المتوفى أنثى (لصيغة الدعاء)' : 'المُهدى إليه أنثى (لصيغة الرسالة والبطاقة)';
      fIn.disabled = !!st.anon;
      if (!st.edited) mIn.value = autoMsg(st, pName);
      mCnt.textContent = mIn.value.length + ' / 300';
      pv.innerHTML = ''; pv.appendChild(cardPreview(st, pName));
      if (opts.onChange) opts.onChange(st);
    }
    function setOcc(i) {
      st.o = i;
      if (!st.dm) st.d = OCC[i].d;
      if (OCC[i].l === 'مولود جديد' && st.fem && !st.dm) st.d = 11;
      refresh();
    }
    fIn.oninput = function () { st.from = fIn.value; refresh(); };
    anIn.onchange = function () { st.anon = anIn.checked; refresh(); };
    tIn.oninput = function () {
      st.to = tIn.value;
      if (!st.femSet && FEM_RX.test(cleanName(tIn.value))) { st.fem = true; feIn.checked = true; }
      refresh();
    };
    feIn.onchange = function () {
      st.fem = feIn.checked; st.femSet = 1;
      if (OCC[st.o].l === 'مولود جديد' && (st.d === 1 || st.d === 11)) st.d = st.fem ? 11 : 1;
      refresh();
    };
    mIn.oninput = function () { st.edited = 1; st.msg = mIn.value; mCnt.textContent = mIn.value.length + ' / 300'; };
    mRst.onclick = function () { st.edited = 0; st.msg = ''; refresh(); };
    refresh();
    return {
      validate: function () {
        var to = cleanName(st.to), from = st.anon ? 'فاعل خير' : cleanName(st.from);
        if (opts.pickProject && !PROJECTS[st.p]) return 'اختر المشروع الذي تبرعت فيه.';
        if (!from || from.length < 2) return 'اكتب اسمك، أو اختر «أخفِ اسمي».';
        if (!to || to.length < 2) return OCC[st.o].dead ? 'اكتب اسم المتوفى.' : 'اكتب اسم المُهدى إليه.';
        return '';
      }
    };
  }
  function newState(p) { return {noLink:false, p:p || '', o:0, d:0, th:0, ns:1, fem:false, anon:false, from:'', to:'', msg:'', edited:0, dm:0}; }

  /* ===================== 1) صفحة المشروع ===================== */
  function productPage(slug) {
    var addBtn = $('form[id^="product-form-"] a#add') || $('a#add.single_add_to_cart_button');
    if (!addBtn) return false;
    var form = addBtn.closest('form'), row = addBtn.closest('.checkout-buttons') || addBtn.parentNode;
    if (!form || $('.mng-open', form.parentNode)) return true;
    style();
    var wrap = el('div', 'mng'); wrap.style.width = '100%';
    var btn = el('button', 'mng-open', '🎁 أهدِ من تحب'); btn.type = 'button';
    var panel = el('div', 'mng-panel'); panel.style.display = 'none';
    wrap.appendChild(btn); wrap.appendChild(panel);
    row.parentNode.insertBefore(wrap, row.nextSibling);

    var st = newState(slug), saved = ls('mn_gift');
    if (saved && saved.p === slug && Date.now() - saved.ts < KEEP_MS) { for (var k in saved) if (k in st) st[k] = saved[k]; }
    var built = false, api;

    function shares() {
      return $$('input[name="qnty_choose"]', form).map(function (r) {
        var lab = r.closest('label'), t = lab ? lab.textContent.replace(/\s+/g, ' ').trim() : '';
        var v = +r.value; return {v:v, t:t || (v + ' ريال'), r:r};
      }).filter(function (x) { return x.v > 0; });
    }
    function build() {
      built = true;
      panel.appendChild(el('h4', '', 'بطاقة الإهداء'));
      var sh = shares(), pick = 0;
      var shBox;
      if (sh.length) {
        panel.appendChild(el('label', 'mng-l', 'مبلغ الإهداء'));
        shBox = el('div', 'mng-chips'); panel.appendChild(shBox);
        var drawSh = function () {
          shBox.innerHTML = '';
          sh.forEach(function (x, i) {
            var b = el('button', 'mng-chip' + (i === pick ? ' on' : ''), x.t.indexOf(String(x.v)) >= 0 ? x.t : x.t + ' ' + x.v + ' ريال');
            b.type = 'button'; b.onclick = function () { pick = i; drawSh(); }; shBox.appendChild(b);
          });
          var ob = el('button', 'mng-chip' + (pick < 0 ? ' on' : ''), 'مبلغ آخر'); ob.type = 'button';
          ob.onclick = function () { pick = -1; drawSh(); setTimeout(function () { amt.focus(); }, 50); }; shBox.appendChild(ob);
          amtWrap.style.display = pick < 0 ? 'block' : 'none';
        };
        var minV = 1;
        var amtWrap = el('div'), amt = el('input'); amt.type = 'text'; amt.inputMode = 'numeric'; amt.setAttribute('dir', 'ltr'); amt.min = minV; amt.step = 1;
        var setMin = function (m) { minV = m; amt.min = m; amt.placeholder = 'اكتب المبلغ بالريال (' + m + ' أو أكثر)'; }; setMin(1);
        fetch('/api/v1/products/' + form.id.replace('product-form-', ''), {headers:{Accept:'application/json'}}).then(function (r) { return r.json(); })
          .then(function (j) { var p = j && j.data && j.data.product, m = p && +p.min_quantity_per_cart; if (m > 0) setMin(m); }).catch(function () {});
        amt.placeholder = amt.placeholder; amtWrap.style.marginTop = '8px'; amtWrap.appendChild(amt);
        panel.appendChild(amtWrap);
        drawSh();
      }
      var fh = el('div'); panel.appendChild(fh);
      api = buildForm(fh, st, {});
      var err = el('div', 'mng-err'); panel.appendChild(err);
      var go = el('button', 'mng-btn mng-b1', 'تبرّع وأهدِ'); go.type = 'button'; panel.appendChild(go);
      panel.appendChild(el('div', 'mng-hint', 'بعد الدفع تظهر صفحة «أكمل هديتك» تلقائيًا. وإن لم تظهر، افتح: mmcm.sa/#hadiya-complete'));
      go.onclick = function () {
        var e = api.validate();
        if (!e && sh.length && pick < 0) { var av = Math.floor(+toEn(amt.value)); if (!(av >= minV)) e = 'اكتب مبلغًا لا يقل عن ' + minV + ' ريال.'; }
        err.textContent = e; err.style.display = e ? 'block' : 'none'; if (e) return;
        var s = {}; for (var k in st) s[k] = st[k]; s.ts = Date.now(); ls('mn_gift', s);
        ev('add_to_cart');
        if (sh.length) {
          var val = pick < 0 ? Math.floor(+toEn(amt.value)) : sh[pick].v;
          if (pick >= 0) { try { sh[pick].r.checked = true; sh[pick].r.click(); } catch (z) {} }
          else $$('input[name="qnty_choose"]', form).forEach(function (r) { r.checked = false; });
          var q = $('#product-quantity', form);
          if (q) { q.value = val; q.dispatchEvent(new Event('input', {bubbles:true})); q.dispatchEvent(new Event('change', {bubbles:true})); }
        }
        go.disabled = true; go.textContent = 'جارٍ الإضافة للسلة…';
        setTimeout(function () {
          if (typeof window.singleProductAddToCartRedirect === 'function') window.singleProductAddToCartRedirect(form.id);
          else addBtn.click();
          setTimeout(function () { go.disabled = false; go.textContent = 'تبرّع وأهدِ'; }, 4000);
        }, 120);
      };
    }
    function open(scroll) {
      if (!built) build();
      panel.style.display = 'block'; ev('panel_open');
      if (scroll) setTimeout(function () { try { wrap.scrollIntoView({behavior:'smooth', block:'start'}); } catch (e) {} }, 300);
    }
    btn.onclick = function () { ev('gift_click'); if (panel.style.display === 'none') { open(false); btn.classList.add('on'); } else { panel.style.display = 'none'; btn.classList.remove('on'); } };
    if (location.hash === '#hadiya-open') { setTimeout(function () { try { wrap.scrollIntoView({behavior:'smooth', block:'center'}); } catch (e) {} btn.classList.add('mng-pulse'); setTimeout(function () { btn.classList.remove('mng-pulse'); }, 4000); }, 400); try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    return true;
  }

  /* ===================== 2) بطاقات المشاريع ===================== */
  function cards() {
    $$('.product-card-with-gift').forEach(function (c) {
      if (c.getAttribute('data-mng')) return;
      var a = $('a[href*="/products/"]', c); if (!a) return;
      var m = a.getAttribute('href').match(/\/products\/([^\/?#]+)/); if (!m) return;
      var slug = decodeURIComponent(m[1]); if (!hasP(slug)) return;
      var row = $('.checkout-buttons', c); if (!row) return;
      c.setAttribute('data-mng', '1'); style();
      var l = el('a', 'mng-cardlink', '🎁 أهدِ من تحب'); l.href = '/products/' + slug + '#hadiya-open';
      l.onclick = function () { ev('gift_click'); };
      row.parentNode.insertBefore(l, row.nextSibling);
    });
  }

  /* ===================== النافذة العامة ===================== */
  function overlay(title, noClose) {
    style();
    var ov = el('div', 'mng-ov mng'), box = el('div', 'mng-box'), x = el('button', 'mng-x', '×'), closed = false;
    x.type = 'button'; x.setAttribute('aria-label', 'إغلاق');
    var close = function () { closed = true; clearInterval(keep); ov.remove(); document.documentElement.style.overflow = ''; };
    x.onclick = close; if (noClose) x.style.display = 'none';
    box.appendChild(x); if (title) box.appendChild(el('h3', '', title));
    var body = el('div'); box.appendChild(body); ov.appendChild(box);
    var host = document.documentElement;
    host.appendChild(ov); host.style.overflow = 'hidden';
    /* صفحات زد تعيد رسم الصفحة أحيانًا فتمسح النافذة: نعيدها ما لم يغلقها الزائر */
    var keep = setInterval(function () { if (!closed && !ov.isConnected) { host.appendChild(ov); host.style.overflow = 'hidden'; } }, 400);
    return {ov:ov, body:body, close:close, allowClose:function () { x.style.display = ''; }};
  }
  function b64Blob(b64) {
    var bin = atob(b64), n = bin.length, u = new Uint8Array(n); for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], {type:'image/png'});
  }

  /* ===================== 3) أكمل هديتك ===================== */
  function orderFromText(t) {
    var m = String(t || '').match(/\/(?:order-completed|orders)\/([A-Za-z0-9]{6,24})\/invoice/);
    return m ? m[1] : '';
  }
  function guessProject(order, st, cb) {
    /* المتصفح نفسه يقرأ فاتورته (نفس الموقع) ليعرف المشروع فقط، ولا نحفظ منها شيئًا */
    fetch('/api/v1/orders/' + encodeURIComponent(order) + '/invoice', {credentials:'same-origin', headers:{Accept:'application/json'}})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var prods = (j && (j.data && j.data.order && j.data.order.products || j.order && j.order.products || j.products)) || [];
        var names = prods.map(function (p) { var n = p && p.name; return typeof n === 'object' ? (n && (n.ar || n.en)) : n; }).join(' ');
        if (names && !(hasP(st.p) && names.indexOf(PROJECTS[st.p]) >= 0)) {
          st.p = ''; for (var s in PROJECTS) if (names.indexOf(PROJECTS[s]) >= 0) { st.p = s; break; }
        }
        cb();
      }).catch(function () { cb(); });
  }
  function complete(order) {
    ev('complete_view');
    var o = overlay('أكمل هديتك', true), body = o.body;
    var later = el('a', '', 'أكمل لاحقًا'); later.href = 'javascript:void 0';
    later.style.cssText = 'display:block;text-align:center;font-size:12.5px;color:#667085;margin-top:12px';
    later.onclick = function () { if (window.confirm('يمكنك إكمال الهدية لاحقًا من الرابط: mmcm.sa/#hadiya-complete\nهل تريد الإغلاق الآن؟')) o.close(); };
    o.ov.firstChild.appendChild(later);
    var saved = ls('mn_gift'), st = newState('');
    var fresh = saved && Date.now() - saved.ts < KEEP_MS;
    if (fresh) for (var k in saved) if (k in st) st[k] = saved[k];
    var done = ls('mn_gift_done');
    if (done && done.ts && Date.now() - done.ts > 90 * 864e5) { ls('mn_gift_done', null); done = null; }
    if (!order) { var so = ls('mn_gift_ord'); if (so && Date.now() - so.ts < 7 * 864e5) order = so.c; }

    function askOrder() {
      body.innerHTML = '';
      body.appendChild(el('div', 'mng-hint', 'الصق رابط صفحة الشكر أو رابط «عرض الفاتورة» الذي وصلك بعد التبرع.'));
      var i = el('input'); i.type = 'text'; i.placeholder = 'https://mmcm.sa/orders/…/invoice'; i.style.direction = 'ltr'; body.appendChild(i);
      var e = el('div', 'mng-err'); body.appendChild(e);
      var b = el('button', 'mng-btn mng-b1', 'متابعة'); b.type = 'button'; body.appendChild(b);
      b.onclick = function () {
        var c = orderFromText(i.value);
        if (!c) { e.textContent = 'الرابط غير صحيح. انسخه كما هو من صفحة الشكر أو الفاتورة.'; e.style.display = 'block'; return; }
        order = c; ls('mn_gift_ord', {c:c, ts:Date.now()}); start();
      };
    }
    function start() {
      if (!order) return askOrder();
      body.innerHTML = '';
      if (done && done.o === order && done.c && done.c.length) {
        body.appendChild(el('div', 'mng-hint', 'أصدرت لهذا التبرع:'));
        done.c.forEach(function (c, i) {
          var b = el('button', 'mng-btn mng-b2', 'افتح البطاقة ' + (i + 1)); b.type = 'button';
          b.onclick = function () { reopen(c); }; body.appendChild(b);
        });
        if (done.c.length >= 2) { body.appendChild(el('div', 'mng-hint', 'الحد بطاقتان لكل تبرع.')); return; }
        body.appendChild(el('div', 'mng-hint', 'ويمكنك إهداء شخص ثانٍ من نفس التبرع:'));
        st.to = ''; st.fem = false; st.edited = 0;
      }
      body.appendChild(el('div', 'mng-spin', 'لحظة…')); guessProject(order, st, form);
    }
    function form() {
      if (body.lastChild && body.lastChild.className === 'mng-spin') body.removeChild(body.lastChild);
      var fh = el('div'); body.appendChild(fh);
      var api = buildForm(fh, st, {pickProject: !st.p || st.forcePick});
      var e = el('div', 'mng-err'); body.appendChild(e);
      var b = el('button', 'mng-btn mng-b1', 'أصدر البطاقة'); b.type = 'button'; body.appendChild(b);
      b.onclick = function () {
        var m = api.validate(); e.textContent = m; e.style.display = m ? 'block' : 'none'; if (m) return;
        b.disabled = true; b.textContent = 'نتأكد من التبرع ونصنع البطاقة…';
        post({a:'issue', order:order, p:st.p, o:st.o, d:st.d, th:st.th, ns:st.ns, fem:st.fem ? 1 : 0,
              anon:st.anon ? 1 : 0, from:cleanName(st.from), to:cleanName(st.to), dev:dev()})
          .then(function (r) {
            if (r && r.ok && r.code && r.img) {
              var d = ls('mn_gift_done'); if (!d || d.o !== order) d = {o:order, c:[]};
              d.c.push(r.code); d.ts = Date.now(); d.t = d.t || {}; ls('mn_gift_done', d); done = d;
              ls('mn_gift', null);
              result(st, r.code, r.img);
            } else fail(r && r.error);
          })
          .catch(function () { fail('net'); });
        function fail(code) {
          b.disabled = false; b.textContent = 'أصدر البطاقة';
          if (code === 'wrong_project') { st.p = ''; st.forcePick = 1; body.innerHTML = ''; form(); var e2 = body.querySelector('.mng-err'); if (e2) { e2.textContent = ERR[code]; e2.style.display = 'block'; } return; }
          e.textContent = ERR[code] || ERR.server; e.style.display = 'block';
        }
      };
    }
    function reopen(code) {
      body.innerHTML = ''; body.appendChild(el('div', 'mng-spin', 'لحظة…'));
      post({a:'card', c:code}).then(function (r) {
        if (r && r.ok && r.img) result(st, code, r.img, true);
        else { body.innerHTML = ''; body.appendChild(el('div', 'mng-err', ERR[r && r.error] || ERR.server)).style.display = 'block'; }
      }).catch(function () { body.innerHTML = ''; var x = el('div', 'mng-err', ERR.net); x.style.display = 'block'; body.appendChild(x); });
    }
    function result(st2, code, b64, old) {
      body.innerHTML = '';
      var pName = PROJECTS[st2.p] || '';
      var res = el('div', 'mng-res'), im = el('img'); im.src = 'data:image/png;base64,' + b64; im.alt = 'بطاقة الإهداء';
      res.appendChild(im); body.appendChild(res);
      var saved2 = ls('mn_gift_done'), txt;
      if (old && saved2 && saved2.t && saved2.t[code]) txt = saved2.t[code];
      else if (st2.p && st2.to) txt = (st2.edited && st2.msg ? st2.msg.trim() : autoMsg(st2, pName)) + (st2.noLink ? '' : '\n' + linkLine(st2, code));
      else txt = 'أُهديت لك بطاقة خير من جمعية منارات مكة 🤍\n' + link(code);
      if (!old && saved2 && saved2.o === order) { saved2.t = saved2.t || {}; saved2.t[code] = txt; ls('mn_gift_done', saved2); done = saved2; }
      o.allowClose(); later.style.display = 'none';
      var box = el('div', 'mng-msgbox', txt); body.appendChild(box);
      var file = null; try { file = new File([b64Blob(b64)], 'hadiya-' + code + '.png', {type:'image/png'}); } catch (z) {}
      var wa = el('button', 'mng-btn mng-bw', 'أرسل البطاقة والرسالة في واتساب'); wa.type = 'button'; body.appendChild(wa);
      wa.onclick = function () {
        ev('sent_whatsapp');
        if (file && navigator.canShare && isMobile() && navigator.canShare({files:[file]})) {
          try { navigator.clipboard && navigator.clipboard.writeText(txt).catch(function () {}); } catch (z) {}
          navigator.share({files:[file], text:txt}).catch(function () {});
          tip.style.display = 'block';
        } else window.open('https://wa.me/?text=' + encodeURIComponent(txt.indexOf(link(code)) >= 0 ? txt : txt + '\n' + link(code)), '_blank');
      };
      if (isMobile() && st2.p && !old) {
        var sms = el('a', 'mng-btn mng-bs', '✉️ أرسلها برسالة نصية'); sms.href = 'sms:?&body=' + encodeURIComponent(smsMsg(st2, pName, code));
        sms.onclick = function () { ev('sent_sms'); }; body.appendChild(sms);
      }
      var tip = el('div', 'mng-hint', 'نسخنا نص الرسالة لك. إن وصلت الصورة بلا نص في واتساب، ألصقه في المحادثة.'); tip.style.display = 'none'; tip.style.textAlign = 'center'; wa.parentNode.insertBefore(tip, wa.nextSibling);
      var cp = el('button', 'mng-btn mng-b2', 'نسخ الرسالة'); cp.type = 'button'; body.appendChild(cp);
      cp.onclick = function () {
        ev('copy_msg');
        var ok = function () { cp.textContent = 'تم النسخ ✓'; setTimeout(function () { cp.textContent = 'نسخ الرسالة'; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () {}); else { var t = el('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (z) {} t.remove(); }
      };
      var sv = el('a', 'mng-btn mng-b2', 'حفظ البطاقة صورة'); sv.href = 'data:image/png;base64,' + b64; sv.download = 'hadiya-' + code + '.png';
      sv.onclick = function () { ev('save_img'); }; body.appendChild(sv);
      if (done && done.o === order && done.c.length < 2) {
        var more = el('button', 'mng-btn mng-b2', '🎁 أهدِ شخصًا ثانيًا من نفس التبرع'); more.type = 'button';
        more.onclick = function () { start(); }; body.appendChild(more);
      }
      body.appendChild(el('div', 'mng-small', 'رسالتك أنت من واتسابك، لا من رقم الجمعية. بطاقة إهداء، وليست إيصال تبرع · الرمز ' + code.slice(0, 4) + '-' + code.slice(4)));
    }
    start();
  }
  var ERR = {
    not_paid: 'لم يتأكد الدفع بعد. انتظر دقيقة ثم أعد المحاولة.',
    not_found: 'لم نجد التبرع. تأكد من الرابط، أو انتظر دقيقة ثم أعد المحاولة.',
    wrong_project: 'هذا التبرع ليس في المشروع المختار. اختر المشروع الصحيح.',
    max: 'أصدرت بطاقتين لهذا التبرع، وهذا الحد.',
    locked: 'محاولات كثيرة. حاول بعد ساعة.',
    review: 'الاسم يحتاج مراجعة من الجمعية قبل إصدار البطاقة.',
    paused: 'الإهداء متوقف مؤقتًا. حاول لاحقًا.',
    bad_name: 'الأسماء حروف فقط، حتى 25 حرفًا.',
    bad_order: 'رابط التبرع غير صحيح.',
    unavailable: 'هذه البطاقة غير متاحة.',
    net: 'تعذّر الاتصال. تأكد من الإنترنت ثم أعد المحاولة.',
    server: 'حدث خطأ. أعد المحاولة بعد قليل.'
  };

  /* ===================== 4) صفحة المُهدى إليه ===================== */
  function recipient(code) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    ev('recipient_open');
    var o = overlay('وصلتك هدية خير'), body = o.body;
    body.appendChild(el('div', 'mng-spin', 'نفتح البطاقة…'));
    post({a:'card', c:code}).then(function (r) {
      body.innerHTML = '';
      if (!r || !r.ok) { var e = el('div', 'mng-dua', ERR[r && r.error] || ERR.unavailable); body.appendChild(e); return; }
      var slug = hasP(r.p) ? r.p : '', pName = PROJECTS[slug] || '';
      if (r.expired) {
        body.appendChild(el('div', 'mng-dua', 'انتهت مدة عرض هذه البطاقة. جزى الله من أهداها خيرًا.'));
      } else {
        var res = el('div', 'mng-res'), im = el('img'); im.src = 'data:image/png;base64,' + r.img; im.alt = 'بطاقة الإهداء';
        res.appendChild(im); body.appendChild(res);
        body.appendChild(el('div', 'mng-dua', r.from ? 'شارك في عمارة بيوت الله كما شارك ' + r.from + '.' : 'شارك في عمارة بيوت الله.'));
      }
      if (slug) {
        var d = el('a', 'mng-btn mng-b1', 'تبرّع أنت أيضًا في «' + pName + '»'); d.href = '/products/' + slug;
        d.onclick = function () { ev('recipient_donate'); }; body.appendChild(d);
        var g = el('a', 'mng-btn mng-b2', '🎁 أهدِ من تحب'); g.href = '/products/' + slug + '#hadiya-open';
        g.onclick = function () { ev('recipient_gift'); }; body.appendChild(g);
      }
      if (!r.expired && r.from && !r.dead) {
        var t = el('a', 'mng-btn mng-bs', '💚 اشكر ' + r.from + ' في واتساب');
        t.href = 'https://wa.me/?text=' + encodeURIComponent('جزاك الله خيرًا يا ' + r.from + ' على إهدائي أجر «' + pName + '» لمساجد مكة 💚');
        t.target = '_blank'; t.rel = 'noopener'; t.onclick = function () { ev('thank_click'); }; body.appendChild(t);
      }
      body.appendChild(el('div', 'mng-small', 'بطاقة إهداء، وليست إيصال تبرع · الرمز ' + code.slice(0, 4) + '-' + code.slice(4) + ' · جمعية منارات مكة للعناية بالمساجد'));
    }).catch(function () { body.innerHTML = ''; body.appendChild(el('div', 'mng-dua', ERR.net)); });
  }

  /* ===================== صفحة الشكر ===================== */
  function thanksPage(order) {
    ls('mn_gift_ord', {c:order, ts:Date.now()});
    var saved = ls('mn_gift');
    var dn = ls('mn_gift_done'), red = ls('mn_gift_redir');
    var already = (dn && dn.o === order) || (red && red.c === order);
    if (saved && Date.now() - saved.ts < KEEP_MS && !already) {
      var h = overlay('شكرًا لتبرعك 🤍', true);
      h.body.appendChild(el('div', 'mng-spin', 'نجهّز بطاقة إهدائك…'));
      var t0 = Date.now(), gone = false, loaded = document.readyState === 'complete' ? t0 : 0;
      var go = function () { if (gone) return; gone = true; ls('mn_gift_redir', {c:order, ts:Date.now()}); location.replace('/#hadiya-complete'); };
      if (!loaded) window.addEventListener('load', function () { loaded = Date.now(); });
      /* ننتظر اكتمال الصفحة ثم 1.5 ثانية حتى تعمل أكواد قياس الإعلانات، وبحد أقصى 6 ثوانٍ */
      var w = setInterval(function () { var n = Date.now(); if (n - t0 > 6000 || (loaded && n - loaded > 1500 && n - t0 > 1500)) { clearInterval(w); go(); } }, 250);
      return;
    }
    style();
    var bar = el('div', 'mng'); bar.style.cssText = 'position:fixed;bottom:14px;left:12px;right:12px;z-index:2147482000;max-width:460px;margin:0 auto';
    var b = el('button', 'mng-btn mng-b1', '🎁 أهدِ أجر تبرعك لمن تحب'); b.type = 'button'; b.style.boxShadow = '0 6px 20px rgba(0,0,0,.2)';
    var x = el('button', '', '×'); x.type = 'button';
    x.style.cssText = 'position:absolute;top:2px;left:-4px;width:26px;height:26px;border-radius:50%;border:0;background:#fff;color:#344054;box-shadow:0 1px 4px rgba(0,0,0,.25);cursor:pointer;font-size:16px;line-height:26px;padding:0';
    b.onclick = function () { bar.remove(); complete(order); }; x.onclick = function () { bar.remove(); };
    bar.appendChild(b); bar.appendChild(x); document.body.appendChild(bar);
  }

  /* ===================== التشغيل ===================== */
  var routed = {};
  function route() {
    var h = location.hash || '', m, key = location.pathname + h;
    if (routed[key]) return; routed[key] = 1;
    if ((m = h.match(/^#hadiya=([A-Za-z0-9-]{8,10})$/))) { recipient(m[1].replace(/-/g, '').toUpperCase()); return; }
    if (h === '#hadiya-complete') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} complete(''); return; }
    var ord = orderFromText(location.pathname);
    if (ord) { thanksPage(ord); return; }
  }
  function boot() {
    try { route(); } catch (e) {}
    var pm = location.pathname.match(/^\/products\/([^\/?#]+)\/?$/), slug = pm && decodeURIComponent(pm[1]);
    if (slug && hasP(slug)) {
      var n = 0; (function tryP() { if (!productPage(slug) && ++n < 20) setTimeout(tryP, 500); })();
    }
    cards();
    var t, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(cards, 300); });
    mo.observe(document.body, {childList:true, subtree:true});
    setTimeout(function () { mo.disconnect(); }, 30000);
    window.addEventListener('hashchange', function () { try { route(); } catch (e) {} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
