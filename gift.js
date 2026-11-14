/* ============================================================
   gift.js — «🎁 أهدِ من تحب» — جمعية منارات مكة (متجر زد mmcm.sa، 3264753)
   v2.3 — 2026-11-14: تحسين الواجهة (الملفان 83 و84): العنوان هو السؤال، لمس 44، تباين أعلى، المختار بعلامة ✓، الخطأ تحت خانته، صندوق الرسالة و«تعديل»، صف البطاقة المختصر، وصفحة المُهدى إليه بجملة الإهداء. زر «أهدِ من تحب» وأيقونته ونبضه بلا تغيير
   v2.2 — 2026-11-13: نص الكبسولة «أجر مشروع «…» بمكة المكرمة» (وللمتوفى «في مشروع»)، والاسم الطويل يصغر درجة أو درجتين تلقائياً، وبطاقة المتوفى بالأسود والأبيض والفضي (تصميم mourn: غامقة وفاتحة فقط)
   v2.1 — 2026-11-13: ألوان البطاقات الجديدة — كحلي وفيروزي من هوية منارات (الأزرار والنقاط والتحديد وبطاقتا الغامق والفاتح)
   v2.0 — 2026-11-13: إهداء مبسّط — نافذة من 3 خطوات (المناسبة ← الأسماء ← المبلغ)، التصميم وحجم الاسم تلقائيان، نص الواتساب بعد الإصدار، و«تأكد من الأسماء» بعد الدفع
   يُحمَّل من manarat-widgets.js من نفس رقم الـcommit (لا @main).
   يعمل في:
     1) صفحة المشروع  /products/<slug>        زر يفتح نافذة الإهداء (و #hadiya-open ينزل إلى الزر وينبض ولا يفتح شيئاً)
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
  /* أيقونة الهدية (زر صفحة المشروع + رابط بطاقات المشاريع فقط). ثابتة: لا يدخلها أي نص من الزائر */
  var ICON = '<svg class="mng-ic" viewBox="0 0 64 64" aria-hidden="true"><g><rect x="14" y="30" width="36" height="25" rx="4" fill="#E53935"/><rect x="14" y="32" width="36" height="3" fill="#7A1515" fill-opacity=".45"/><rect x="29" y="35" width="6" height="20" fill="#F5B52A"/><rect x="10" y="22" width="44" height="10" rx="3" fill="#C62828"/><rect x="28" y="22" width="8" height="10" fill="#F5B52A"/><path d="M32 22C25 22 17 20 17 14.5C17 10 23 10 26 13.5C29 17 32 22 32 22Z" fill="none" stroke="#F5B52A" stroke-width="3" stroke-linejoin="round"/><path d="M32 22C39 22 47 20 47 14.5C47 10 41 10 38 13.5C35 17 32 22 32 22Z" fill="none" stroke="#F5B52A" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="22" r="4" fill="#F5A300"/></g></svg>';

  var PROJECTS = {
    'mobile-musalla': 'المصلّى المتنقّل', 'water': 'سقيا المساجد', 'taqwa-trio': 'ثلاثية التقوى',
    'perfume': 'تطييب المساجد', 'full-care': 'العناية الشاملة بالمساجد', 'carpet': 'فرش المساجد',
    'ramadan-ready': 'تهيئة المساجد لرمضان', 'daily-blessing': 'بركتك اليومية'
  };

  /* المناسبات: الترتيب يطابق OCC في سكربت الجمعية حرفياً. d = التصميم المقترح.
     قاعدة دائمة: أي مناسبة أو تصميم جديد يُضاف في آخر القائمة فقط، وفي الملفين معاً. */
  var OCC = [
    {g:0, l:'إهداء عام', e:'🎁', s:'إهداء عام', m:'جعله الله في ميزان حسناتك', f:'جعله الله في ميزان حسناتكِ', w:'من قلبي أهديك صدقة في بيوت الله.. عسى فرحتها توصلك اليوم، وأجرها يدوم لك كل يوم.', d:0},
    {g:0, l:'مولود جديد', e:'👶', s:'مولود جديد', m:'بارك الله لكم في ما وهبكم، وجعله قرة عين لكم', w:'يا مرحبا باللي زادكم فرح.. حبّينا نشارككم فرحة قدومه بصدقة في بيوت الله. جعله الله قرّة عين لكم.', d:1},
    {g:0, l:'زواج', e:'💍', s:'زواج', m:'بارك الله لكما وبارك عليكما وجمع بينكما في خير', w:'يا عسى عمركم كله أفراح.. ومع أول أيامكم سوا، حبّينا نشارككم الفرحة بصدقة عنكم في بيوت الله.', d:2},
    {g:0, l:'تخرّج', e:'🎓', s:'تخرّج', m:'مبارك تخرّجك، وجعل الله علمك نافعاً', f:'مبارك تخرّجكِ، وجعل الله علمكِ نافعاً', w:'تعب السنين صار فرحة تخرّج.. ومن فرحتي فيك اخترت لك هدية يبقى أجرها، صدقة عنك في مساجد مكة.', d:3},
    {g:0, l:'نجاح وتفوّق', e:'⭐', s:'نجاح وتفوّق', m:'مبارك نجاحك، وزادك الله توفيقاً', f:'مبارك نجاحكِ، وزادكِ الله توفيقاً', w:'فرحت لك من قلبي يوم سمعت بنجاحك، وحبّيت أبارك لك على تفوّقك بصدقة في بيوت الله.', d:3},
    {g:0, l:'وظيفة أو ترقية', e:'💼', s:'وظيفة أو ترقية', m:'وفّقك الله، وبارك لك في رزقك', f:'وفّقكِ الله، وبارك لكِ في رزقكِ', w:'مبارك لك هالخطوة، وعسى الله يفتح لك فيها أبواب الرزق. ومن فرحتي بهالبشارة أهديتك صدقة في بيوت الله.', d:12},
    {g:0, l:'منزل جديد', e:'🏠', s:'منزل جديد', m:'بارك الله لك في دارك، وجعلها عامرة بذكره', f:'بارك الله لكِ في داركِ، وجعلها عامرة بذكره', w:'الله يعمّر بيتكم بالأُنس وراحة البال.. ولأنها فرحة دار جديدة، اخترت هديّتكم صدقة في بيوت الله.', d:4},
    {g:0, l:'ختم القرآن', e:'📖', s:'ختم القرآن', m:'جعل الله القرآن ربيع قلبك ونور صدرك', f:'جعل الله القرآن ربيع قلبكِ ونور صدركِ', w:'يا زينها من فرحة يوم ختمت القرآن.. حبّيت أشاركك فرحة الختم بصدقة عنك في بيوت الله. جعل الله القرآن نور قلبك.', d:5},
    {g:0, l:'شكر وتقدير', e:'🌷', s:'شكر وتقدير', m:'جزاك الله خيراً، وشكر لك فضلك', f:'جزاكِ الله خيراً، وشكر لكِ فضلكِ', w:'لك في قلبي دعوة مع كل ما أذكر جميلك، واليوم ضمّيت لدعائي صدقة عنك في بيوت الله.', d:12},
    {g:1, l:'رمضان', e:'🌙', s:'رمضان', m:'مبارك عليك الشهر، وتقبّل الله منك الصيام والقيام', f:'مبارك عليكِ الشهر، وتقبّل الله منكِ الصيام والقيام', w:'مبارك عليك الشهر.. حبّيت أبارك لك بصدقة في بيوت الله.', d:6},
    {g:1, l:'عيد الفطر', e:'🎉', s:'عيد الفطر', m:'تقبّل الله منا ومنكم، وعيدكم مبارك', w:'عيدك مبارك.. وعيديّتك هالسنة صدقة في مساجد مكة. عسى الله يعيده عليك بالفرح والقبول.', d:7},
    {g:1, l:'عيد الأضحى', e:'🐑', s:'عيد الأضحى', m:'تقبّل الله منا ومنكم، وكل عام وأنتم بخير', w:'عساك من عوّاده.. ومع تكبيرات العيد، أهديك منّي صدقة في بيوت الله. كل عام وأنت بخير.', d:7},
    {g:1, l:'عشر ذي الحجة', e:'🕋', s:'عشر ذي الحجة', m:'تقبّل الله منك في خير أيام الدنيا', f:'تقبّل الله منكِ في خير أيام الدنيا', w:'في هالعشر المباركة، حبّيت يكون لك نصيب من صدقتي في بيوت الله. عسى الله يكتب لك أجرها ويتقبّل منّا ومنك.', d:8},
    {g:1, l:'حج أو عمرة', e:'🕋', s:'حج أو عمرة', m:'تقبّل الله طاعتك، وجعل سعيك مشكوراً وذنبك مغفوراً', f:'تقبّل الله طاعتكِ، وجعل سعيكِ مشكوراً وذنبكِ مغفوراً', w:'الحمد لله اللي بلّغك بيته وأتمّ لك نُسكك.. وفرحاً بتمامه أهديتك صدقة في مساجد مكة. تقبّل الله منك.', d:8},
    {g:2, l:'برّ الوالدين', e:'🤲', s:'لوالديّ', m:'برّاً بك، وجزاك الله عني خير الجزاء', f:'برّاً بكِ، وجزاكِ الله عني خير الجزاء', w:'أبي، منك تعلّمت العطاء، ومن أجمل ما أهديك صدقة عنك في بيوت الله. جزاك الله عنّي كل خير.', wf:'أمي، عمري وأنا أفرح بدعواتك، واليوم أهديك مع دعائي صدقة عنك في بيوت الله.', d:13},
    {g:2, l:'صدقة عن متوفى', e:'🕊️', s:'صدقة عن متوفى', dead:1, m:'رحمه الله، وجعلها في ميزان حسناته', f:'رحمها الله، وجعلها في ميزان حسناتها', w:'غاليكم غالٍ علينا.. وهذي صدقة عنه، الله يرحمه.', wf:'غاليتكم غالية علينا.. وهذي صدقة عنها، الله يرحمها.', d:14},
    {g:2, l:'دعاء لمريض بالشفاء', e:'💚', s:'دعاء بالشفاء', m:'نسأل الله أن يشفيك شفاءً لا يغادر سقماً', f:'نسأل الله أن يشفيكِ شفاءً لا يغادر سقماً', w:'طهور إن شاء الله.. تصدّقت عنك، وعسى الله يلبسك ثوب العافية ويقرّ عيوننا بشوفتك بخير.', d:10},
    {g:0, l:'الحمد لله على السلامة', e:'🌿', s:'الحمد لله على السلامة', m:'الحمد لله على سلامتك، وألبسك الله ثوب الصحة والعافية', f:'الحمد لله على سلامتكِ، وألبسكِ الله ثوب الصحة والعافية', w:'الحمد لله على سلامتك.. يوم تطمّنت عليك تصدّقت عنك شكراً لله. عسى أيامك كلها صحة وعافية.', d:10}
  ];
  /* التصاميم: الترتيب يطابق DK في السكربت */
  var DS = [['general','عام'],['boy','مولود'],['wedding','زواج'],['grad','تخرّج'],['home','منزل'],['quran','مصحف'],
    ['ramadan','رمضان'],['eid','عيد'],['hajj','حج'],['calm','هادئ'],['heal','شفاء'],['girl','مولودة'],['thanks','شكر'],['parents','والدان'],
    ['mourn','عزاء']];   /* 14: بطاقة المتوفى فقط (أسود وأبيض وفضي)، لا تظهر في قائمة التصاميم */
  /* الخطوة 1 تعرض ستة مربعات: عام، لوالديّ، صدقة عن متوفى، دعاء بالشفاء، رمضان، تخرّج. الباقي تحت «مناسبات أخرى» */
  var TOP6 = [0, 14, 15, 16, 9, 3];
  var NS = [5.03, 6.18, 7.09];                 // حجم الاسم بوحدة cqw (صغير/متوسط/كبير)
  var FEM_RX = /^(أم |ام |الوالدة|والدة|ماما|يمه|والدتي|أمي|امي|زوجتي|أختي|اختي|ابنتي|بنتي|جدتي|خالتي|عمتي)/;
  var LAB_M = 'بطاقتك', LAB_F = 'بطاقتك\u0650';  /* «بطاقتك» و«بطاقتكِ» في سطر الرابط */
  var KEEP_MS = 48 * 3600e3;                   // مدة حفظ اختيارات البطاقة قبل الدفع

  /* أصل الملفات: نفس commit الملف الذي حمّلنا */
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    if (!s) { var el = document.querySelector('script[src*="manarat-widgets"][src*="gift.js"]'); s = el && el.src; }
    return s ? s.replace(/gift\.js(\?.*)?$/, '') : 'https://cdn.jsdelivr.net/gh/Mnarat/manarat-widgets@main/';
  })();
  function toEn(v) { return String(v || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }).replace(/[^0-9.]/g, ''); }
  function hasP(k) { return !!k && Object.prototype.hasOwnProperty.call(PROJECTS, k); }
  var MOURN = 14;   /* رقم تصميم المتوفى في DS وفي DK بالسكربت */
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
    /* مهلة 60 ثانية حتى لا يبقى الزر معلّقاً إن تأخر السكربت */
    var ac = window.AbortController ? new AbortController() : null;
    if (ac) setTimeout(function () { ac.abort(); }, 60000);
    return fetch(API, {method:'POST', body:JSON.stringify(body), redirect:'follow', signal: ac ? ac.signal : undefined})
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
    '.mng-chk{display:flex;gap:10px;align-items:center;min-height:44px;font-size:14.5px;margin-top:4px;cursor:pointer}',
    '.mng-hint{font-size:12.5px;color:#5b6b80;margin-top:6px}',
    '.mng-err{color:#b42318;font-size:13.5px;font-weight:700;margin-top:6px;display:none}',
    '.mng-btn{display:block;width:100%;font:700 15px/1.4 "Almarai",Tahoma,sans-serif;border:0;border-radius:999px;padding:12px;cursor:pointer;text-align:center;margin-top:10px;text-decoration:none}',
    '.mng-b1{background:' + NAVY + ';color:#fff}.mng-b2{background:#fff;color:' + NAVY + ';border:1.5px solid ' + NAVY + '}',
    '.mng-bw{background:#25D366;color:#073b1d}.mng-bs{background:#fff;color:#075E54;border:1.5px solid #25D366}',
    '.mng-btn[disabled]{opacity:.6;cursor:wait}',
    /* البطاقة */
    '.mng-card{position:relative;width:100%;aspect-ratio:1748/1240;border-radius:12px;overflow:hidden;container-type:inline-size;background-size:cover;background-position:center;background-color:#03183E}',
    '.mng-card .in{position:absolute;left:21.5%;right:21.5%;top:15.5%;bottom:15.5%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}',
    '.mng-card .k1{font-size:1.95cqw;font-weight:700;display:flex;align-items:center;gap:1.1cqw}.mng-card .k1 i{width:3.9cqw;height:1px;background:currentColor;display:block}',
    '.mng-card .to{font-weight:800;line-height:1.2;margin:.9cqw 0 2cqw}',   /* فراغ تحت الاسم لذيل الياء (مثل السكربت) */
    '.mng-card .sep{width:12.6cqw;height:1.4cqw;margin-bottom:.4cqw}',
    '.mng-card .msg{font-family:Amiri,serif;font-size:3.2cqw;line-height:1.6;margin-top:1.1cqw;white-space:pre-line}',
    '.mng-card .opp{font-size:2.12cqw;font-weight:700;padding:1.15cqw 3cqw;border-radius:999px;margin-top:2cqw}',
    '.mng-card .from{font-size:2.12cqw;margin-top:1.8cqw}',
    '.mng-card .bar{position:absolute;top:0;left:0;right:0;background:rgba(5,37,96,.8);color:#fff;font-size:max(2.6cqw,11px);font-weight:700;padding:.8cqw;text-align:center}',
    '.mng-card.d{color:#fff}.mng-card.d .k1{color:#7FE5DC}.mng-card.d .msg{color:#7FE5DC}.mng-card.d .to{text-shadow:0 .23cqw 1.8cqw rgba(0,15,30,.6)}.mng-card.d .msg{text-shadow:0 .1cqw 1.1cqw rgba(0,20,30,.55)}',
    '.mng-card.d .opp{background:rgba(3,18,44,.30);border:1px solid #00B5A7}.mng-card.d .from{color:rgba(255,255,255,.92)}',
    '.mng-card.l{color:#1C2226}.mng-card.l .k1{color:#052560}.mng-card.l .to{color:#052560}.mng-card.l .msg{color:#3A4247}.mng-card.l .opp{background:#052560;color:#fff;border:1px solid #052560}.mng-card.l .from{color:rgba(28,34,38,.85)}',
    /* بطاقة المتوفى: أسود وأبيض وفضي */
    '.mng-card.m.d{background-color:#3C3F43}.mng-card.m.d .k1{color:#D3D7DC}.mng-card.m.d .msg{color:#E4E7EA}.mng-card.m.d .opp{background:rgba(0,0,0,.35);border:1px solid #C3C8CF;color:#fff}.mng-card.m.d .from{color:#F2F4F5}',
    '.mng-card.m.l{background-color:#F6F7F8}.mng-card.m.l .k1{color:#666D75}.mng-card.m.l .to{color:#1C2226}.mng-card.m.l .msg{color:#3A4247}.mng-card.m.l .opp{background:#1C2226;border:1px solid #1C2226;color:#fff}.mng-card.m.l .from{color:#3A4247}',
    '.mng-mrow{display:flex;gap:10px;margin-top:10px}',
    '.mng button.mng-mb{flex:1;height:auto!important;aspect-ratio:1748/1240;min-height:0!important;padding:0!important;position:relative;border:2.5px solid #dfe5ec!important;border-radius:10px!important;background-size:cover!important;background-position:center!important;cursor:pointer;box-shadow:none!important;overflow:hidden}',
    '.mng button.mng-mb.on{border-color:' + TEALD + '!important}',
    '.mng button.mng-mb span{position:absolute;left:0;right:0;bottom:0;color:#fff;background:rgba(5,37,96,.82);font:700 13px/1.7 "Almarai",Tahoma,sans-serif;text-align:center}',
    /* النافذة */
    '.mng-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(5,20,45,.55);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 10px 40px}',
    '.mng-box{max-width:460px;margin:0 auto;background:#fff;border-radius:18px;padding:16px;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.25)}',
    '.mng-x{position:absolute;top:6px;left:8px;width:44px;height:44px;border:0;background:#EAF8F7;border-radius:50%;font-size:20px;line-height:44px;cursor:pointer;color:' + NAVY + ';padding:0}',
    '.mng-box h3{margin:2px 0 10px;color:' + NAVY + ';font-size:18px;font-weight:800;text-align:center}',
    '.mng-box > h3{padding:0 48px;min-height:44px;display:flex;align-items:center;justify-content:center;outline:none}',
    '.mng-res img{width:100%;border-radius:12px;display:block}',
    '.mng-small{font-size:12.5px;color:#5b6b80;text-align:center;margin-top:10px;line-height:1.6}',
    '.mng-dua{text-align:center;color:' + NAVY + ';font-size:14.5px;margin-top:10px}',
    'button.mng-open.mng-pulse{animation-duration:.9s!important}',
    '@keyframes mngp{0%,100%{box-shadow:0 0 0 0 rgba(0,181,167,0)}50%{box-shadow:0 0 0 7px rgba(0,181,167,.38),0 0 18px rgba(0,181,167,.45)}}',
    'button.mng-open{animation:mngp 2.2s ease-in-out infinite}button.mng-open.on{animation:none}',
    '.mng-spin{text-align:center;color:' + NAVY + ';padding:30px 0;font-size:15px}',
    /* ثيم إيثار يمسح حدود وخلفيات الأزرار: نثبّتها */
    'button.mng-open,a.mng-cardlink{border:1.5px solid ' + NAVY + '!important;background:#fff!important;color:' + NAVY + '!important;border-radius:999px!important}',
    'button.mng-open{padding:13px 14px!important;font-size:18px!important;font-weight:800!important;width:100%!important;min-height:44px}',
    /* زر الإهداء بجانب «تبرع الان»: نفس زوايا وارتفاع وخط زر الثيم (6px / 44px / 16px-700) ويبقى بإطار كحلي ليظل «تبرع الان» هو الأساسي */
    'button.mng-open.mng-side{order:5;flex:0 1 auto;width:auto!important;min-width:200px;min-height:44px!important;margin:0!important;padding:4px 22px!important;font-size:16px!important;font-weight:700!important;border-radius:6px!important}',
    '@keyframes mngs{0%,100%{box-shadow:0 0 0 0 rgba(0,181,167,0)}50%{box-shadow:0 0 0 4px rgba(0,181,167,.30),0 0 12px rgba(0,181,167,.35)}}',
    'button.mng-open.mng-side:not(.on){animation-name:mngs}',
    '@media(max-width:767px){button.mng-open.mng-side{flex:1 1 100%;width:100%!important;padding:4px 14px!important;font-size:16px!important}}',
    'a.mng-cardlink{min-height:46px;font-size:19px!important;font-weight:700!important;padding:6px 14px!important;border-radius:30px!important;animation:none}a.mng-cardlink:hover,a.mng-cardlink:focus-visible{box-shadow:0 0 0 4px rgba(0,181,167,.30)}',
    '.mng .mng-btn{border-radius:999px!important;padding:12px!important;font-size:15px!important;box-shadow:none!important;width:100%!important}',
    '.mng .mng-b1{background:' + NAVY + '!important;color:#fff!important;border:0!important}',
    '.mng .mng-b2{background:#fff!important;color:' + NAVY + '!important;border:1.5px solid ' + NAVY + '!important}',
    '.mng .mng-bw{background:#25D366!important;color:#073b1d!important;border:0!important}',
    '.mng .mng-bs{background:#fff!important;color:#075E54!important;border:1.5px solid #25D366!important}',
    '.mng button.mng-x{background:#EAF8F7!important;color:' + NAVY + '!important;border:0!important;border-radius:50%!important;padding:0!important;width:44px!important;height:44px!important;line-height:44px!important;min-height:0!important}',
    /* أيقونة الهدية داخل الزر ورابط البطاقات: يمين النص، ولا تغيّر ارتفاع الزر (الأيقونة أقصر من سطر النص) */
    'button.mng-open,a.mng-cardlink{display:flex!important;align-items:center;justify-content:center;gap:8px;direction:rtl}',
    '.mng-ic{width:30px!important;height:30px!important;flex:0 0 auto;display:block;overflow:visible}',
    '.mng-cardlink .mng-ic{width:28px!important;height:28px!important}',
    '@media (prefers-reduced-motion:no-preference){@keyframes mngbeat{0%,55%,100%{transform:translateY(0) scale(1) rotate(0)}62%{transform:translateY(-8%) scale(1.14) rotate(-9deg)}70%{transform:translateY(-8%) scale(1.14) rotate(8deg)}78%{transform:translateY(-4%) scale(1.08) rotate(-5deg)}86%{transform:translateY(0) scale(1) rotate(2deg)}} .mng-ic g{transform-box:fill-box;transform-origin:center bottom;animation:mngbeat 2.6s ease-in-out infinite}} @media (prefers-reduced-motion:reduce){button.mng-open,a.mng-cardlink{animation:none!important}}',
    /* ===== v2 المبسّط: نافذة بخطوات ثلاث (كل القواعد !important لأن ثيم إيثار يمسح الأزرار والخانات) ===== */
    '.mng-sheet{padding:0!important;overflow:hidden!important;display:flex;align-items:flex-end;justify-content:center}',
    '.mng-sheet .mng-box{width:100%;max-width:none;margin:0;border-radius:22px 22px 0 0;padding:0;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,.25)}',
    '.mng-sh{display:flex;align-items:center;gap:8px;padding:12px 14px 6px;flex:0 0 auto}',
    '.mng-sh h3{flex:1;margin:0!important;text-align:center;font-size:18px;outline:none}',
    '.mng .mng-sh button{width:44px!important;height:44px!important;border:0!important;border-radius:50%!important;background:#EAF8F7!important;color:' + NAVY + '!important;font-size:20px!important;line-height:44px!important;padding:0!important;min-height:0!important;box-shadow:none!important;cursor:pointer;position:static!important;flex:0 0 auto}',
    '.mng-sub{flex:0 0 auto}',
    '.mng-sb{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:4px 16px 8px;scroll-padding-bottom:96px}',
    '@media(min-width:768px){.mng-sheet{align-items:center}.mng-sheet .mng-box{max-width:460px;border-radius:18px;max-height:90vh;box-shadow:0 10px 40px rgba(0,0,0,.25)}}',
    '@media (prefers-reduced-motion:no-preference){@keyframes mngup{from{transform:translateY(36px);opacity:0}to{transform:none;opacity:1}}.mng-sheet .mng-box{animation:mngup .25s ease-out}}',
    '.mng-dots{display:flex;justify-content:center;align-items:center;gap:6px;padding:2px 0 10px}',
    '.mng-dots i{width:28px;height:5px;border-radius:3px;background:#CFEDEA;display:block}.mng-dots i.on{background:' + TEALD + '}',
    '.mng-dots small{font-size:13px;color:#5b6b80;margin-inline-start:6px}',
    '.mng-q{font-size:19px;font-weight:800;color:' + NAVY + ';margin:6px 0 12px;text-align:center}',
    '.mng-lab{display:block;font-weight:800;font-size:15px;color:' + NAVY + ';margin:14px 0 6px}',
    '.mng-note{font-size:12.5px;color:#5b6b80;text-align:center;margin-top:10px}',
    '.mng-pv{width:62%;margin:0 auto}',
    '.mng-lead{font-size:14px;color:#5b6b80;text-align:center;margin:0 0 14px}',
    '.mng-cap{font-size:13px;color:#5b6b80;text-align:center;margin:10px 0 6px}',
    '.mng-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.mng button.mng-tile{position:relative;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:86px!important;width:auto!important;padding:14px 8px!important;border:1px solid #008F85!important;background:#fff!important;border-radius:14px!important;text-align:center;cursor:pointer;font:700 15px "Almarai",Tahoma,sans-serif!important;color:' + NAVY + '!important;box-shadow:none!important}',
    '.mng button.mng-tile b{font-size:28px;line-height:1;font-weight:400}',
    '.mng-olist{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}',
    '.mng button.mng-ob{position:relative;width:auto!important;min-height:48px!important;padding:10px 6px!important;border:1px solid #008F85!important;background:#fff!important;border-radius:10px!important;text-align:center;cursor:pointer;font:700 15px "Almarai",Tahoma,sans-serif!important;color:' + NAVY + '!important;box-shadow:none!important}',
    '.mng button.mng-tile.on,.mng button.mng-ob.on,.mng button.mng-segb.on,.mng button.mng-amt.on{border:2px solid ' + NAVY + '!important;background:#E0F5F3!important}',
    '.mng button.mng-tile.on::after,.mng button.mng-ob.on::after,.mng button.mng-segb.on::after,.mng button.mng-amt.on::after{content:"\\2713";position:absolute;top:6px;left:8px;width:20px;height:20px;border-radius:50%;background:' + NAVY + ';color:#fff;font:800 12px/20px "Almarai",Tahoma,sans-serif;text-align:center;pointer-events:none}',
    '.mng input.mng-inp,.mng textarea.mng-inp,.mng select.mng-inp{display:block;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:13px 12px!important;border:1px solid #667085!important;border-radius:12px!important;background:#fff!important;color:#1d2939!important;font:16px/1.5 "Almarai",Tahoma,sans-serif!important;text-align:right!important;box-shadow:none!important}',
    '.mng input.mng-inp:focus,.mng textarea.mng-inp:focus,.mng select.mng-inp:focus{outline:none!important;border:2px solid ' + NAVY + '!important;box-shadow:0 0 0 3px #CFEDEA!important}',
    '.mng input.mng-inp.bad,.mng input.mng-inp.bad:focus{border:2px solid #b42318!important}',
    '.mng input.mng-inp::placeholder,.mng textarea.mng-inp::placeholder{color:#667085!important;opacity:1!important}',
    '.mng textarea.mng-inp{resize:vertical}',
    '.mng-chk input{width:22px!important;height:22px!important;margin:0!important;accent-color:' + NAVY + ';flex:0 0 auto}',
    '.mng-seg2{display:flex;gap:8px;margin-top:8px}',
    '.mng button.mng-segb{position:relative;flex:1;width:auto!important;height:48px!important;min-height:0!important;padding:0!important;border:1px solid #008F85!important;background:#fff!important;border-radius:12px!important;cursor:pointer;font:700 15px "Almarai",Tahoma,sans-serif!important;color:' + NAVY + '!important;box-shadow:none!important}',
    '.mng-amts{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.mng button.mng-amt{position:relative;width:auto!important;height:52px!important;min-height:0!important;padding:0 6px!important;border:1px solid #008F85!important;background:#fff!important;border-radius:12px!important;cursor:pointer;font:800 17px "Almarai",Tahoma,sans-serif!important;color:' + NAVY + '!important;box-shadow:none!important}',
    '.mng button.mng-amt.wide{grid-column:1/-1;font-size:15px!important;font-weight:700!important}',
    '.mng-dsrow{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch}',
    '.mng button.mng-dsb{flex:0 0 76px!important;width:76px!important;height:54px!important;min-height:0!important;padding:0!important;position:relative;border:2.5px solid transparent!important;border-radius:9px!important;background-size:cover!important;background-position:center!important;cursor:pointer;box-shadow:none!important}',
    '.mng button.mng-dsb.on{border-color:' + TEALD + '!important}',
    '.mng button.mng-dsb span{position:absolute;bottom:1px;left:0;right:0;font-size:12px;font-weight:700;color:#fff;background:rgba(5,37,96,.82);border-radius:0 0 6px 6px;line-height:1.5;text-shadow:none;pointer-events:none}',
    '.mng button.mng-lk{display:flex!important;align-items:center;justify-content:center;width:fit-content!important;min-height:44px!important;height:auto!important;margin:6px auto 0!important;padding:10px 12px!important;border:0!important;background:none!important;color:' + NAVY + '!important;font:700 14.5px "Almarai",Tahoma,sans-serif!important;text-decoration:underline!important;text-decoration-color:#00B5A7!important;text-decoration-thickness:2px!important;text-underline-offset:4px!important;text-align:center;cursor:pointer;box-shadow:none!important}',
    '.mng a.mng-lk{display:flex!important;align-items:center;justify-content:center;width:fit-content!important;min-height:44px!important;margin:6px auto 0!important;padding:10px 12px!important;text-align:center;color:' + NAVY + '!important;font:700 14.5px "Almarai",Tahoma,sans-serif!important;text-decoration:underline!important;text-decoration-color:#00B5A7!important;text-decoration-thickness:2px!important;text-underline-offset:4px!important;cursor:pointer}',
    '.mng .mng-main{display:flex!important;align-items:center;justify-content:center;gap:8px;width:100%!important;height:auto!important;min-height:54px!important;margin:16px 0 0!important;padding:8px 12px!important;line-height:1.4!important;border:0!important;border-radius:14px!important;background:' + NAVY + '!important;color:#fff!important;font:800 17px "Almarai",Tahoma,sans-serif!important;text-align:center;text-decoration:none!important;cursor:pointer;box-shadow:none!important}',
    '.mng .mng-main[disabled]{opacity:.7!important;cursor:not-allowed}',
    '.mng .mng-main.wa{background:#25D366!important;color:#fff!important}',   /* أبيض: قرار عبدالله 19:20 (التباين 1.98) */
    '.mng .mng-main.sec{background:#fff!important;color:' + NAVY + '!important;border:1.5px solid ' + NAVY + '!important;min-height:48px!important;font-size:15px!important;font-weight:700!important;padding:6px 10px!important}',
    '.mng .mng-main.thx{min-height:48px!important;margin-top:10px!important;background:#fff!important;color:' + NAVY + '!important;border:1.5px solid ' + NAVY + '!important;font-size:15px!important;font-weight:700!important}',
    '.mng-stick{position:sticky;bottom:0;margin-top:16px;padding:12px 0 max(10px,env(safe-area-inset-bottom));background:linear-gradient(to top,#fff 78%,rgba(255,255,255,0))}',
    '.mng-stick .mng-err{text-align:center;margin:0 0 8px}','.mng-stick .mng-main{margin-top:0!important}',
    '.mng-mini{display:flex;gap:8px;margin-top:12px}','.mng .mng-mini a{text-align:center}',
    '.mng .mng-mini button,.mng .mng-mini a{flex:1;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:auto!important;height:auto!important;min-height:0!important;padding:10px 4px!important;border:1.5px solid #d7ebe9!important;background:#fff!important;border-radius:12px!important;cursor:pointer;font:700 13.5px "Almarai",Tahoma,sans-serif!important;color:' + NAVY + '!important;text-decoration:none!important;box-shadow:none!important}',
    '.mng .mng-mini b{font-size:20px;line-height:1.2;font-weight:400}',
    '.mng-sum{background:#EAF8F7;border:0;border-radius:12px;padding:12px;font-size:15px;margin-top:12px;display:flex;flex-direction:column;gap:6px}',
    '.mng-sum div{display:flex;justify-content:space-between;gap:8px}.mng-sum span{color:#5b6b80}.mng-sum b{color:' + NAVY + ';font-weight:800}',
    /* ===== v2.3 — تحسين الواجهة (الملف 84): اللمس 44، التباين، التركيز، المختار بعلامة ===== */
    '.mng-ov :focus-visible{outline:3px solid ' + NAVY + '!important;outline-offset:2px!important}',
    '.mng-ov h3[tabindex]:focus,.mng-ov h3[tabindex]:focus-visible{outline:none!important}',
    '.mng-ov button:active{transform:scale(.98)}',
    '.mng-ov button,.mng-ov a{touch-action:manipulation;-webkit-tap-highlight-color:transparent}',
    '.mng button.mng-soft{display:flex!important;align-items:center;justify-content:center;width:100%!important;min-height:48px!important;height:auto!important;margin:10px 0 0!important;padding:8px 12px!important;border:0!important;border-radius:12px!important;background:#EAF8F7!important;color:' + NAVY + '!important;font:700 15px "Almarai",Tahoma,sans-serif!important;cursor:pointer;box-shadow:none!important}',
    '.mng-gl{display:block;font-weight:800;font-size:15px;color:' + NAVY + ';margin:14px 0 6px}',
    '.mng-stick .mng-note{margin-top:8px}',
    '.mng-crow{display:flex;align-items:center;gap:10px;margin-top:14px;padding:8px;border-radius:12px;background:#EAF8F7}',
    '.mng-crow img{width:96px;height:68px;border-radius:8px;object-fit:cover;flex:0 0 auto;display:block}',
    '.mng-crow .t{flex:1;min-width:0;display:flex;flex-direction:column}.mng-crow .t small{font-size:12.5px;color:#5b6b80}.mng-crow .t b{font-size:15px;font-weight:700;color:' + NAVY + ';overflow-wrap:anywhere}',
    '.mng .mng-crow button.mng-lk{margin:0!important;flex:0 0 auto}',
    '.mng-mbox{background:#EAF8F7;border-radius:12px;padding:12px;margin-top:12px}',
    '.mng-mbox .top{display:flex;justify-content:space-between;align-items:center;gap:8px}.mng-mbox .top small{font-size:12.5px;color:#5b6b80}',
    '.mng .mng-mbox .top button.mng-lk{margin:0!important;padding:0 8px!important}',
    '.mng-mbox p{margin:4px 0 6px;font-size:14.5px;color:#1d2939;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere}',
    '.mng-mbox .ln{font-size:12.5px;color:#5b6b80;overflow-wrap:anywhere}',
    '.mng-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}',
    '.mng .mng-two .mng-main{margin:0!important}',
    '.mng-hr{height:1px;background:#CFEDEA;margin:8px 0}',
    '.mng-ic2{width:24px;height:24px;flex:0 0 auto;display:block}',
    '.mng-say{text-wrap:balance;font-size:15px;font-weight:700;color:' + NAVY + ';text-align:center;margin:12px 0 0;line-height:1.6}',
    '.mng-ask{font-size:13.5px;color:#5b6b80;text-align:center;margin:14px 0 8px}',
    '.mng-lks{display:flex;justify-content:center;flex-wrap:wrap;gap:0 16px}.mng .mng-lks .mng-lk{margin:6px 0 0!important}',
    '.mng-ehint{display:flex;justify-content:space-between;align-items:center;gap:8px}.mng .mng-ehint button.mng-lk{margin:0!important;font-size:13.5px!important}'
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
  /* حجم الاسم يُحسب من طوله: ≤9 حروف كبير (2)، ≤16 متوسط (1)، غير ذلك صغير (0) */
  function autoNs(n) { var L = cleanName(n).length; return L <= 9 ? 2 : (L <= 16 ? 1 : 0); }
  function hasF(o) { return !!(o.f || o.wf); }
  function cardPreview(st, pName, barTxt) {
    var o = OCC[st.o], L = st.th === 1, M = !!o.dead, g = M ? (L ? '#666D75' : '#D3D7DC') : (L ? '#052560' : '#7FE5DC');
    st.ns = autoNs(st.to);
    var c = el('div', 'mng-card ' + (L ? 'l' : 'd') + (M ? ' m' : ''));
    c.style.backgroundImage = 'url("' + img(st.d, L) + '")';
    var inn = el('div', 'in');
    var k = el('div', 'k1'); k.appendChild(el('i')); k.appendChild(document.createTextNode(o.dead ? 'صدقة عن' : 'إهداء إلى')); k.appendChild(el('i'));
    var to = el('div', 'to', cleanName(st.to) || (o.dead ? 'اسم المتوفى' : 'من تحب')); /* الاسم الطويل يصغر تلقائياً درجة أو درجتين حتى يبقى في سطر واحد (مثل السكربت) */
    var nmTxt = to.textContent, stp = [62, 54, 44, 40, 36], si = stp.indexOf([44, 54, 62][st.ns]), sMx = Math.min(4, si + 2);
    while (si >= 0 && si < sMx && nmTxt.length * stp[si] * 0.56 > 498) si++;
    to.style.fontSize = (si >= 0 ? (stp[si] / 8.74).toFixed(2) : NS[st.ns]) + 'cqw';
    var sep = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sep.setAttribute('class', 'sep'); sep.setAttribute('viewBox', '0 0 110 12');
    sep.innerHTML = '<path d="M0 6H44M66 6H110" stroke="' + g + '"/><circle cx="48" cy="6" r="1.6" fill="' + g + '"/><circle cx="62" cy="6" r="1.6" fill="' + g + '"/><path d="M55 0L61 6L55 12L49 6Z" fill="' + g + '"/>';
    inn.appendChild(k); inn.appendChild(to); inn.appendChild(sep);
    inn.appendChild(el('div', 'msg', splitDua(dua(st))));
    inn.appendChild(el('div', 'opp', (o.dead ? 'في مشروع «' : 'أجر مشروع «') + pName + '» بمكة المكرمة'));
    inn.appendChild(el('div', 'from', (o.dead ? 'من: ' : 'مُهداة من: ') + fromName(st)));
    c.appendChild(inn);
    c.appendChild(el('div', 'bar', barTxt || 'معاينة — تظهر البطاقة كاملة بعد إتمام التبرع'));
    return c;
  }
  function fromName(st) { return st.anon ? 'فاعل خير' : (cleanName(st.from) || 'اسمك'); }
  function autoMsg(st, pName) {
    var o = OCC[st.o], f = st.fem, F = fromName(st), T = cleanName(st.to) || (o.dead ? 'اسم المتوفى' : 'من تحب');
    if (o.w) return (st.fem && o.wf) ? o.wf : o.w;
    return o.dead ? 'تصدّق ' + F + ' عن ' + T + ' بـ«' + pName + '» لمساجد مكة، ' + (f ? 'رحمها' : 'رحمه') + ' الله'
                  : T + '، ' + (f ? 'أهداكِ ' : 'أهداك ') + F + ' أجر «' + pName + '» لمساجد مكة 🤍';
  }
  function linkLine(st, code) { return (st.fem ? LAB_F : LAB_M) + ': ' + link(code || 'XXXXXXXX'); }
  function smsMsg(st, pName, code) {
    var o = OCC[st.o], F = fromName(st), T = cleanName(st.to);
    return (o.dead ? 'تصدّق ' + F + ' عن ' + T + ' عبر جمعية منارات مكة: '
                   : T + '، ' + (st.fem ? 'أهداكِ ' : 'أهداك ') + F + ' أجر «' + pName + '» عبر جمعية منارات مكة: ') + link(code);
  }
  function amountOf(A) {
    if (A.pick >= 0 && A.sh[A.pick]) return A.sh[A.pick].v;
    return Math.floor(+toEn(A.other)) || 0;
  }

  /* ===================== المعالج: ثلاث خطوات (المناسبة ← الأسماء ← المبلغ) ===================== */
  /* st: {p,o,d,th,ns,fem,anon,from,to,dm,...}
     opts: {shell, pickProject, withAmount, A, picked, step, onStep, onPick, onGo, onDone, doneText, error} */
  function wizard(host, st, opts) {
    opts = opts || {};
    var total = opts.withAmount ? 3 : 2, step = opts.step || 1, picked = !!opts.picked, looks = false,
        moreOcc = picked && TOP6.indexOf(st.o) < 0, shell = opts.shell, scroller = shell ? shell.body : host;
    function pName() { return PROJECTS[st.p] || 'المشروع'; }
    function dots() {
      if (!shell) return;
      shell.sub.innerHTML = '';
      var row = el('div', 'mng-dots');
      for (var i = 1; i <= total; i++) { var x = el('i'); if (i <= step) x.className = 'on'; row.appendChild(x); }
      row.appendChild(el('small', '', 'الخطوة ' + step + ' من ' + total));
      shell.sub.appendChild(row);
    }
    /* يرجع {m: النص، f: 'to' أو 'from' أو ''} حتى يظهر الخطأ تحت خانته */
    function validate() {
      var to = cleanName(st.to), from = st.anon ? 'فاعل خير' : cleanName(st.from);
      if (opts.pickProject && !PROJECTS[st.p]) return {m:'اختر المشروع الذي تبرعت له.', f:''};
      if (!to || to.length < 2) return {m:OCC[st.o].dead ? 'اكتب اسم المتوفى.' : 'اكتب اسم من تهديه.', f:'to'};
      if (!from || from.length < 2) return {m:'اكتب اسمك، أو اختر «لا تُظهر اسمي».', f:'from'};
      return null;
    }
    function title() {
      if (step === 1) return 'ما مناسبة الهدية؟';
      if (step === 2) return OCC[st.o].dead ? 'عن مَن تتصدق؟' : 'لمن الهدية؟';
      return opts.A && opts.A.sh.length ? 'كم تريد أن تتبرع؟' : 'بطاقتك';
    }
    /* مكان الزر المضغوط (فهارسه من host) حتى يرجع إليه التركيز بعد إعادة الرسم */
    function focusPath() {
      var a = document.activeElement, path = [];
      if (!a || a.tagName !== 'BUTTON' || !host.contains(a)) return null;
      for (var n = a; n && n !== host; n = n.parentNode) path.unshift(Array.prototype.indexOf.call(n.parentNode.children, n));
      return path;
    }
    function draw(same) {
      var keep = same ? scroller.scrollTop : 0, fp = same ? focusPath() : null;
      host.innerHTML = '';
      dots();
      if (shell) { shell.setTitle(title()); shell.setBack(step > 1 ? function () { step--; if (opts.onStep) opts.onStep(step); draw(); } : null); }
      if (opts.onStep) opts.onStep(step);
      if (step === 1) step1(); else if (step === 2) step2(); else step3();
      scroller.scrollTop = keep;
      if (fp) { var n = host; for (var k = 0; n && k < fp.length; k++) n = n.children[fp[k]]; if (n && n.tagName === 'BUTTON') { try { n.focus({preventScroll:true}); } catch (z) { n.focus(); } } }
      else if (!same && shell && shell.focusTitle) shell.focusTitle();
    }

    /* الخطوة 1: ما مناسبة الهدية؟ */
    function step1() {
      var pe = null;
      if (opts.pickProject) {
        host.appendChild(el('label', 'mng-lab', 'المشروع الذي تبرعت له'));
        var sel = el('select', 'mng-inp'); sel.appendChild(new Option('اختر المشروع', ''));
        for (var s in PROJECTS) sel.appendChild(new Option(PROJECTS[s], s));
        sel.value = st.p || '';
        sel.onchange = function () { st.p = sel.value; pe.style.display = 'none'; };
        host.appendChild(sel);
        pe = el('div', 'mng-err'); host.appendChild(pe);
        if (opts.error) { pe.textContent = opts.error; pe.style.display = 'block'; opts.error = ''; }
      }
      if (opts.withAmount) host.appendChild(el('p', 'mng-lead', 'تتبرع باسمه، وتصلك بطاقة ترسلها له في واتساب.'));
      function pick(i) {
        if (opts.pickProject && !PROJECTS[st.p]) { pe.textContent = 'اختر المشروع الذي تبرعت له.'; pe.style.display = 'block'; try { pe.scrollIntoView({block:'nearest'}); } catch (z) {} return; }
        st.o = i; if (OCC[i].dead) st.d = MOURN; else if (!st.dm || st.d === MOURN) st.d = OCC[i].d; if (!hasF(OCC[i])) st.fem = false;
        picked = true; if (opts.onPick) opts.onPick();
        step = 2; draw();
      }
      var t = el('div', 'mng-tiles'); t.setAttribute('role', 'group'); t.setAttribute('aria-label', 'المناسبة');
      TOP6.forEach(function (i) {
        var b = el('button', 'mng-tile' + (picked && st.o === i ? ' on' : '')); b.type = 'button'; b.setAttribute('aria-pressed', picked && st.o === i ? 'true' : 'false');
        b.appendChild(el('b', '', OCC[i].e)); b.appendChild(document.createTextNode(OCC[i].s));
        b.onclick = function () { pick(i); }; t.appendChild(b);
      });
      host.appendChild(t);
      var mb = el('button', 'mng-soft', moreOcc ? 'إخفاء المناسبات الأخرى ▴' : 'مناسبات أخرى (' + (OCC.length - TOP6.length) + ') ▾'); mb.type = 'button';
      mb.setAttribute('aria-expanded', moreOcc ? 'true' : 'false');
      mb.onclick = function () { moreOcc = !moreOcc; draw(true); }; host.appendChild(mb);
      if (moreOcc) {
        var ol = el('div', 'mng-olist');
        OCC.forEach(function (o, i) {
          if (TOP6.indexOf(i) >= 0) return;
          var b = el('button', 'mng-ob' + (picked && st.o === i ? ' on' : ''), o.e + ' ' + o.s); b.type = 'button'; b.setAttribute('aria-pressed', picked && st.o === i ? 'true' : 'false');
          b.onclick = function () { pick(i); }; ol.appendChild(b);
        });
        host.appendChild(ol);
      }
    }

    /* الخطوة 2: لمن الهدية؟ */
    function step2() {
      var o = OCC[st.o], dead = !!o.dead, F = hasF(o);
      if (!F) st.fem = false; else if (!st.femSet && FEM_RX.test(cleanName(st.to))) st.fem = true;
      var tl = el('label', 'mng-lab', dead ? 'اسم المتوفى' : 'اسم من تهديه'); tl.htmlFor = 'mng-to'; tl.style.marginTop = '0'; host.appendChild(tl);
      var ti = el('input', 'mng-inp'); ti.id = 'mng-to'; ti.type = 'text'; ti.maxLength = 25; ti.value = st.to || '';
      ti.placeholder = dead ? 'مثال: محمد' : 'مثال: أبو تميم'; ti.setAttribute('autocomplete', 'off'); ti.setAttribute('enterkeyhint', 'next');
      host.appendChild(ti);
      var te = el('div', 'mng-err'); te.id = 'mng-to-err'; te.setAttribute('role', 'alert'); host.appendChild(te);
      var th = el('div', 'mng-hint', 'حروف فقط، حتى 25 حرفاً.'); th.id = 'mng-to-hint'; host.appendChild(th);
      ti.setAttribute('aria-describedby', 'mng-to-err mng-to-hint');
      var bm = null, bf = null, pv = null;
      function rp() { if (!pv) return; pv.innerHTML = ''; pv.appendChild(cardPreview(st, pName(), 'معاينة')); }
      function sf(v) {
        st.fem = v; bm.className = 'mng-segb' + (v ? '' : ' on'); bf.className = 'mng-segb' + (v ? ' on' : '');
        bm.setAttribute('aria-pressed', v ? 'false' : 'true'); bf.setAttribute('aria-pressed', v ? 'true' : 'false'); rp();
      }
      if (F) {
        var gl = el('div', 'mng-gl', dead ? 'المتوفى' : 'الهدية لـ'); gl.id = 'mng-gl'; host.appendChild(gl);
        var seg = el('div', 'mng-seg2'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-labelledby', 'mng-gl'); seg.style.marginTop = '0';
        bm = el('button', 'mng-segb', 'رجل'); bf = el('button', 'mng-segb', 'امرأة');
        bm.type = bf.type = 'button'; seg.appendChild(bm); seg.appendChild(bf); host.appendChild(seg);
        bm.onclick = function () { st.femSet = 1; sf(false); }; bf.onclick = function () { st.femSet = 1; sf(true); };
      }
      var fl = el('label', 'mng-lab', 'اسمك'); fl.htmlFor = 'mng-from'; host.appendChild(fl);
      var fi = el('input', 'mng-inp'); fi.id = 'mng-from'; fi.type = 'text'; fi.maxLength = 25; fi.value = st.from || ''; fi.placeholder = 'مثال: عبدالله';
      fi.disabled = !!st.anon; fi.setAttribute('autocomplete', 'off'); fi.setAttribute('enterkeyhint', 'done'); host.appendChild(fi);
      var fe = el('div', 'mng-err'); fe.id = 'mng-from-err'; fe.setAttribute('role', 'alert'); host.appendChild(fe);
      fi.setAttribute('aria-describedby', 'mng-from-err');
      var ck = el('label', 'mng-chk'), ci = el('input'); ci.type = 'checkbox'; ci.checked = !!st.anon;
      ck.appendChild(ci); ck.appendChild(document.createTextNode('لا تُظهر اسمي (يُكتب «فاعل خير»)')); host.appendChild(ck);
      host.appendChild(el('div', 'mng-cap', 'هكذا تظهر الأسماء على البطاقة'));
      pv = el('div', 'mng-pv'); host.appendChild(pv);
      if (F) sf(!!st.fem); else rp();
      var foot = el('div', 'mng-stick'), err = el('div', 'mng-err');
      var nx = el('button', 'mng-main', opts.withAmount ? 'التالي: المبلغ' : (opts.doneText || 'التالي')); nx.type = 'button';
      foot.appendChild(err); foot.appendChild(nx); host.appendChild(foot);
      function clr(inp, e) { e.style.display = 'none'; e.textContent = ''; inp.classList.remove('bad'); inp.removeAttribute('aria-invalid'); }
      function hide() { err.style.display = 'none'; clr(ti, te); clr(fi, fe); }
      ti.oninput = function () {
        st.to = ti.value; hide();
        if (F && !st.femSet && !st.fem && FEM_RX.test(cleanName(ti.value))) sf(true); else rp();
      };
      fi.oninput = function () { st.from = fi.value; hide(); rp(); };
      ci.onchange = function () { st.anon = ci.checked; fi.disabled = st.anon; hide(); rp(); };
      ti.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); if (!fi.disabled) fi.focus(); else nx.click(); } };
      fi.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); nx.click(); } };
      nx.onclick = function () {
        var v = validate();
        if (v) {
          var inp = v.f === 'to' ? ti : (v.f === 'from' ? fi : null), e = v.f === 'to' ? te : (v.f === 'from' ? fe : err);
          e.textContent = v.m; e.style.display = 'block';
          if (inp) { inp.classList.add('bad'); inp.setAttribute('aria-invalid', 'true'); try { inp.focus(); } catch (z) {} }
          return;
        }
        hide();
        if (opts.withAmount) { step = 3; draw(); }
        else if (opts.onDone) opts.onDone(nx, err);
      };
    }

    /* الخطوة 3: كم تريد أن تتبرع؟ */
    function step3() {
      var A = opts.A, sh = A.sh, dead = !!OCC[st.o].dead;
      var foot = el('div', 'mng-stick'), err = el('div', 'mng-err');
      var go = el('button', 'mng-main'); go.type = 'button';
      function upd() { var v = amountOf(A); go.textContent = (sh.length && v) ? 'تبرّع وأهدِ · ' + v + ' ريال' : 'تبرّع وأهدِ'; }
      if (sh.length) {
        var a = el('div', 'mng-amts'); a.setAttribute('role', 'group'); a.setAttribute('aria-label', 'المبلغ');
        sh.forEach(function (x, i) {
          var b = el('button', 'mng-amt' + (A.pick === i ? ' on' : ''), x.t.indexOf(String(x.v)) >= 0 ? x.t : x.t + ' ' + x.v + ' ريال'); b.type = 'button';
          b.setAttribute('aria-pressed', A.pick === i ? 'true' : 'false');
          b.onclick = function () { A.pick = i; A.touched = 1; draw(true); }; a.appendChild(b);
        });
        var ob = el('button', 'mng-amt wide' + (A.pick < 0 ? ' on' : ''), 'مبلغ آخر'); ob.type = 'button'; ob.setAttribute('aria-pressed', A.pick < 0 ? 'true' : 'false');
        ob.onclick = function () { A.pick = -1; A.touched = 1; draw(true); setTimeout(function () { var i = $('#mng-oth', host); if (i) i.focus(); }, 50); };
        a.appendChild(ob); host.appendChild(a);
        if (A.pick < 0) {
          var ol = el('label', 'mng-lab', 'المبلغ بالريال'); ol.htmlFor = 'mng-oth'; host.appendChild(ol);
          var oi = el('input', 'mng-inp'); oi.id = 'mng-oth'; oi.type = 'text'; oi.inputMode = 'numeric'; oi.setAttribute('dir', 'ltr'); oi.setAttribute('enterkeyhint', 'done');
          oi.value = A.other; oi.style.textAlign = 'left'; oi.setAttribute('aria-describedby', 'mng-oth-hint'); host.appendChild(oi);
          var oh = el('div', 'mng-hint', A.minV + ' ريال أو أكثر.'); oh.id = 'mng-oth-hint'; host.appendChild(oh);
          oi.oninput = function () { A.other = oi.value.replace(/[^0-9٠-٩۰-۹]/g, ''); if (oi.value !== A.other) oi.value = A.other; err.style.display = 'none'; upd(); };
        }
      }
      if (dead) st.d = MOURN;
      /* صف البطاقة المختصر: صورة صغيرة + «إلى الاسم» + «غيّر الشكل» */
      var cr = el('div', 'mng-crow'), ci = el('img'); ci.src = img(st.d, st.th); ci.alt = '';
      var ct = el('div', 't'); ct.appendChild(el('small', '', 'بطاقتك'));
      ct.appendChild(el('b', '', (dead ? 'عن ' : 'إلى ') + (cleanName(st.to) || (dead ? 'اسم المتوفى' : 'من تحب'))));
      var lk = el('button', 'mng-lk', looks ? 'إخفاء ▴' : 'غيّر الشكل'); lk.type = 'button'; lk.setAttribute('aria-expanded', looks ? 'true' : 'false');
      lk.onclick = function () { looks = !looks; draw(true); };
      cr.appendChild(ci); cr.appendChild(ct); cr.appendChild(lk); host.appendChild(cr);
      if (dead) {
        /* المتوفى: البطاقتان (غامقة وفاتحة) ظاهرتان دائماً، ولا تصاميم ملونة */
        var mr = el('div', 'mng-mrow');
        ['غامقة', 'فاتحة'].forEach(function (t, i) {
          var b = el('button', 'mng-mb' + (st.th === i ? ' on' : '')); b.type = 'button'; b.setAttribute('aria-pressed', st.th === i ? 'true' : 'false');
          b.style.backgroundImage = 'url("' + img(MOURN, i) + '")'; b.appendChild(el('span', '', t));
          b.onclick = function () { st.th = i; draw(true); }; mr.appendChild(b);
        });
        host.appendChild(mr);
      }
      if (looks) {
        var big = cardPreview(st, pName(), 'شكل تقريبي، والبطاقة النهائية بعد التبرع'); big.style.marginTop = '12px'; host.appendChild(big);
        if (!dead) {
          var row = el('div', 'mng-dsrow'); row.style.marginTop = '10px';
          DS.forEach(function (d, i) {
            if (i === MOURN) return;
            var b = el('button', 'mng-dsb' + (st.d === i ? ' on' : '')); b.type = 'button'; b.setAttribute('aria-pressed', st.d === i ? 'true' : 'false');
            b.style.backgroundImage = 'url("' + img(i, st.th) + '")'; b.appendChild(el('span', '', d[1]));
            b.onclick = function () { st.d = i; st.dm = 1; draw(true); }; row.appendChild(b);
          });
          host.appendChild(row);
          var seg = el('div', 'mng-seg2');
          ['🌙 غامقة', '☀️ فاتحة'].forEach(function (t, i) {
            var b = el('button', 'mng-segb' + (st.th === i ? ' on' : ''), t); b.type = 'button'; b.setAttribute('aria-pressed', st.th === i ? 'true' : 'false');
            b.onclick = function () { st.th = i; draw(true); }; seg.appendChild(b);
          });
          host.appendChild(seg);
        }
      }
      upd();
      foot.appendChild(err); foot.appendChild(go);
      foot.appendChild(el('div', 'mng-note', 'بعد الدفع تصلك البطاقة هنا، وترسلها أنت. لا نطلب رقم جوالك.'));
      host.appendChild(foot);
      go.onclick = function () { opts.onGo(go, err); };
    }
    draw();
  }

  function newState(p) { return {noLink:false, p:p || '', o:0, d:0, th:0, ns:1, fem:false, anon:false, from:'', to:'', msg:'', edited:0, dm:0}; }
  /* اختيارات قديمة محفوظة في المتصفح قد تحمل رقماً خارج القوائم بعد تحديث: نرجعها للقيم الأولى */
  function fixState(st) {
    if (typeof st.o !== 'number' || !OCC[st.o]) st.o = 0;
    if (typeof st.d !== 'number' || !DS[st.d]) st.d = 0;
    if (OCC[st.o].dead) st.d = MOURN; else if (st.d === MOURN) st.d = OCC[st.o].d;
    if (st.th !== 1) st.th = 0;
    if (typeof st.ns !== 'number' || !NS[st.ns]) st.ns = 1;
    if (st.p && !hasP(st.p)) st.p = '';
    return st;
  }

  /* ===================== 1) صفحة المشروع ===================== */
  function productPage(slug) {
    var addBtn = $('form[id^="product-form-"] a#add') || $('a#add.single_add_to_cart_button');
    if (!addBtn) return false;
    var form = addBtn.closest('form'), row = addBtn.closest('.checkout-buttons') || addBtn.parentNode;
    if (!form || $('.mng-open', form.parentNode)) return true;
    style();
    var wrap = el('div', 'mng'); wrap.style.width = '100%';
    var btn = el('button', 'mng-open', 'أهدِ من تحب'); btn.type = 'button';
    btn.insertAdjacentHTML('afterbegin', ICON);   /* بعد textContent دائماً، وإلا مُسحت الأيقونة */
    if (row.classList.contains('checkout-buttons')) { btn.classList.add('mng-side'); row.appendChild(btn); } else wrap.appendChild(btn);
    row.parentNode.insertBefore(wrap, row.nextSibling);

    var st = newState(slug), saved = ls('mn_gift'), picked = false, wstep = 1;
    if (saved && saved.p === slug && Date.now() - saved.ts < KEEP_MS) { for (var k in saved) if (k in st) st[k] = saved[k]; fixState(st); picked = true; }
    var A = {sh:[], pick:0, other:'', minV:1, touched:0, fetched:0};

    function shares() {
      return $$('input[name="qnty_choose"]', form).map(function (r) {
        var lab = r.closest('label'), t = lab ? lab.textContent.replace(/\s+/g, ' ').trim() : '';
        var v = +r.value; return {v:v, t:t || (v + ' ريال'), r:r};
      }).filter(function (x) { return x.v > 0; });
    }
    /* المبلغ يبدأ بالسهم الذي اختاره المتبرع في الصفحة، وإلا الأول */
    function pageIdx(sh) {
      for (var i = 0; i < sh.length; i++) if (sh[i].r.checked) return i;
      return 0;
    }
    function go(b, err) {
      var v = amountOf(A), t0 = b.textContent;
      if (A.sh.length && A.pick < 0 && !(v >= A.minV)) { err.textContent = 'اكتب مبلغاً لا يقل عن ' + A.minV + ' ريال.'; err.style.display = 'block'; return; }
      err.style.display = 'none';
      st.ns = autoNs(st.to); if (!hasF(OCC[st.o])) st.fem = false;
      var s = {}; for (var k in st) s[k] = st[k]; s.ts = Date.now(); ls('mn_gift', s);
      ev('add_to_cart');
      if (A.sh.length) {
        if (A.pick >= 0) { try { A.sh[A.pick].r.checked = true; A.sh[A.pick].r.click(); } catch (z) {} }
        else $$('input[name="qnty_choose"]', form).forEach(function (r) { r.checked = false; });
        var q = $('#product-quantity', form);
        if (q) { q.value = v; q.dispatchEvent(new Event('input', {bubbles:true})); q.dispatchEvent(new Event('change', {bubbles:true})); }
      }
      b.disabled = true; b.textContent = 'جارٍ الإضافة للسلة…';
      setTimeout(function () {
        if (typeof window.singleProductAddToCartRedirect === 'function') window.singleProductAddToCartRedirect(form.id);
        else addBtn.click();
        setTimeout(function () { b.disabled = false; b.textContent = t0; }, 4000);
      }, 120);
    }
    function openSheet() {
      if (!A.fetched) {
        A.fetched = 1;
        fetch('/api/v1/products/' + form.id.replace('product-form-', ''), {headers:{Accept:'application/json'}}).then(function (r) { return r.json(); })
          .then(function (j) { var p = j && j.data && j.data.product, m = p && +p.min_quantity_per_cart; if (m > 0) A.minV = m; }).catch(function () {});
      }
      A.sh = shares();
      if (!A.touched || A.pick >= A.sh.length) A.pick = pageIdx(A.sh);
      var o = overlay('أهدِ من تحب', false, true), host = el('div');
      o.body.appendChild(host); ev('panel_open');
      wizard(host, st, {shell:o, withAmount:true, pickProject:false, A:A, picked:picked, step:wstep,
        onStep:function (n) { wstep = n; }, onPick:function () { picked = true; }, onGo:go});
    }
    btn.onclick = function () { ev('gift_click'); openSheet(); };
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
      var l = el('a', 'mng-cardlink', 'أهدِ من تحب'); l.href = '/products/' + slug + '#hadiya-open';
      l.insertAdjacentHTML('afterbegin', ICON);
      l.onclick = function () { ev('gift_click'); };
      row.parentNode.insertBefore(l, row.nextSibling);
    });
  }


  /* ===================== النافذة العامة ===================== */
  /* sheet = نافذة الخطوات: من أسفل الشاشة على الجوال، وفي الوسط على الكمبيوتر، برأس (رجوع / عنوان / إغلاق) */
  var dlgN = 0;
  function overlay(title, noClose, sheet) {
    style();
    var ov = el('div', 'mng-ov mng' + (sheet ? ' mng-sheet' : '')), box = el('div', 'mng-box'), x = el('button', 'mng-x', '×'), closed = false;
    var opener = document.activeElement;
    x.type = 'button'; x.setAttribute('aria-label', 'إغلاق');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    var close = function () {
      closed = true; clearInterval(keep); ov.remove(); document.documentElement.style.overflow = ''; document.removeEventListener('keydown', onKey, true);
      try { if (opener && opener.isConnected && opener.focus) opener.focus(); } catch (z) {}
    };
    x.onclick = close;
    var body, h3 = null, sub = null, back = null, backFn = null;
    if (sheet) {
      var head = el('div', 'mng-sh');
      back = el('button', 'mng-back', '→'); back.type = 'button'; back.setAttribute('aria-label', 'رجوع'); back.style.visibility = 'hidden';
      back.onclick = function () { if (backFn) backFn(); };
      h3 = el('h3', '', title);
      head.appendChild(back); head.appendChild(h3); head.appendChild(x);
      sub = el('div', 'mng-sub'); body = el('div', 'mng-sb');
      box.appendChild(head); box.appendChild(sub); box.appendChild(body);
      if (noClose) x.style.visibility = 'hidden'; else ov.onclick = function (e) { if (e.target === ov) close(); };
    } else {
      if (noClose) x.style.display = 'none';
      box.appendChild(x); if (title) { h3 = el('h3', '', title); box.appendChild(h3); }
      body = el('div'); box.appendChild(body);
    }
    if (h3) { h3.id = 'mng-dlg-t' + (++dlgN); h3.tabIndex = -1; h3.style.outline = 'none'; box.setAttribute('aria-labelledby', h3.id); }
    else box.setAttribute('aria-label', 'أهدِ من تحب');
    function canClose() { return x.style.display !== 'none' && x.style.visibility !== 'hidden'; }
    /* Tab يدور داخل النافذة، وEsc يغلق حيث الإغلاق ظاهر */
    function onKey(e) {
      if (closed || !ov.isConnected) return;
      var top = $$('.mng-ov'); if (top[top.length - 1] !== ov) return;   /* النافذة العليا فقط */
      if (e.key === 'Escape' || e.key === 'Esc') { if (canClose()) { e.preventDefault(); close(); } return; }
      if (e.key !== 'Tab') return;
      var f = $$('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', box).filter(function (n) {
        return !n.disabled && n.offsetParent !== null && getComputedStyle(n).visibility !== 'hidden';
      });
      if (!f.length) { e.preventDefault(); return; }
      var a = document.activeElement, i0 = f.indexOf(a);
      if (e.shiftKey && (i0 <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i0 < 0 || i0 === f.length - 1)) { e.preventDefault(); f[0].focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    ov.appendChild(box);
    var host = document.documentElement;
    host.appendChild(ov); host.style.overflow = 'hidden';
    function focusTitle() { if (h3) { try { h3.focus({preventScroll:true}); } catch (z) { h3.focus(); } } }
    setTimeout(focusTitle, 30);
    /* صفحات زد تعيد رسم الصفحة أحياناً فتمسح النافذة: نعيدها ما لم يغلقها الزائر */
    var keep = setInterval(function () { if (!closed && !ov.isConnected) { host.appendChild(ov); host.style.overflow = 'hidden'; } }, 400);
    return {ov:ov, box:box, body:body, sub:sub, close:close, focusTitle:focusTitle,
      setTitle:function (t) { if (h3) h3.textContent = t; },
      setBack:function (fn) { backFn = fn || null; if (back) back.style.visibility = fn ? 'visible' : 'hidden'; },
      allowClose:function () { x.style.display = ''; x.style.visibility = ''; }};
  }
  /* شعار واتساب المعروف (السماعة داخل الفقاعة) — المصدر simple-icons، رخصة CC0 */
  var WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
  function waIcon(color) {
    return '<svg class="mng-ic2" viewBox="0 0 24 24" aria-hidden="true"><path fill="' + (color || 'currentColor') + '" d="' + WA_PATH + '"/></svg>';
  }
  function cardAlt(to, from, dead) {
    to = cleanName(to); from = String(from || '').trim();
    if (!to) return 'بطاقة الإهداء';
    return (dead ? 'بطاقة صدقة عن ' : 'بطاقة إهداء إلى ') + to + (from ? ' من ' + from : '');
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
    /* المتصفح نفسه يقرأ فاتورته (نفس الموقع) ليعرف المشروع فقط، ولا نحفظ منها شيئاً */
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
    var o = overlay('شكراً لتبرعك 🤍', true, true), body = o.body;
    var later = el('button', 'mng-lk', 'أكمل لاحقاً'); later.type = 'button';
    later.style.cssText = 'font-size:13.5px!important;margin:0 auto 8px!important;flex:0 0 auto';
    later.onclick = function () { if (window.confirm('يمكنك إكمال الهدية لاحقاً من الرابط: mmcm.sa/#hadiya-complete\nهل تريد الإغلاق الآن؟')) o.close(); };
    o.box.appendChild(later);
    var saved = ls('mn_gift'), st = newState('');
    var fresh = saved && Date.now() - saved.ts < KEEP_MS;
    if (fresh) { for (var k in saved) if (k in st) st[k] = saved[k]; fixState(st); }
    /* اختيارات محفوظة كاملة: مناسبة واسمان */
    var hasSaved = !!fresh && cleanName(st.to).length >= 2 && (st.anon || cleanName(st.from).length >= 2);
    var picked = hasSaved;
    var done = ls('mn_gift_done');
    if (done && done.ts && Date.now() - done.ts > 90 * 864e5) { ls('mn_gift_done', null); done = null; }
    if (!order) { var so = ls('mn_gift_ord'); if (so && Date.now() - so.ts < 7 * 864e5) order = so.c; }
    var area = null;

    function reset() { o.sub.innerHTML = ''; o.setBack(null); }
    function askOrder() {
      body.innerHTML = ''; reset();
      body.appendChild(el('div', 'mng-note', 'ألصق رابط صفحة الشكر أو رابط «عرض الفاتورة» الذي وصلك بعد التبرع.'));
      var i = el('input', 'mng-inp'); i.type = 'text'; i.placeholder = 'https://mmcm.sa/orders/…/invoice'; i.style.direction = 'ltr'; i.style.marginTop = '10px'; body.appendChild(i);
      var e = el('div', 'mng-err'); body.appendChild(e);
      var b = el('button', 'mng-main', 'متابعة'); b.type = 'button'; body.appendChild(b);
      b.onclick = function () {
        var c = orderFromText(i.value);
        if (!c) { e.textContent = 'الرابط غير صحيح. انسخه كما هو من صفحة الشكر أو الفاتورة.'; e.style.display = 'block'; return; }
        order = c; ls('mn_gift_ord', {c:c, ts:Date.now()}); start();
      };
    }
    function start() {
      if (!order) return askOrder();
      body.innerHTML = ''; reset(); o.setTitle('شكراً لتبرعك 🤍');
      var second = !!(done && done.o === order && done.c && done.c.length);
      if (second) {
        body.appendChild(el('div', 'mng-note', 'أصدرت لهذا التبرع:'));
        done.c.forEach(function (c, i) {
          var b = el('button', 'mng-main sec', 'افتح البطاقة ' + (i + 1)); b.type = 'button';
          b.onclick = function () { reopen(c); }; body.appendChild(b);
        });
        if (done.c.length >= 2) { body.appendChild(el('div', 'mng-note', 'الحد بطاقتان لكل تبرع.')); return; }
        body.appendChild(el('div', 'mng-note', 'ويمكنك إهداء شخص ثانٍ من نفس التبرع:'));
        st.to = ''; st.fem = false; st.edited = 0;
      }
      area = el('div'); body.appendChild(area);
      area.appendChild(el('div', 'mng-spin', 'لحظة…'));
      guessProject(order, st, function () {
        area.innerHTML = '';
        if (hasSaved && !second && st.p && !st.forcePick) confirmScreen(); else wizardScreen(second ? 'second' : '', '');
      });
    }
    /* «تأكد من الأسماء»: ضغطة واحدة بدل إعادة اللوحة كاملة */
    function confirmScreen() {
      area.innerHTML = ''; reset(); o.setTitle('تأكد من الأسماء');
      var pName = PROJECTS[st.p] || '', oc = OCC[st.o];
      area.appendChild(el('p', 'mng-lead', 'شكراً لتبرعك. بقيت خطوة واحدة.')).style.marginBottom = '12px';
      area.appendChild(cardPreview(st, pName, 'معاينة'));
      var sm = el('div', 'mng-sum');
      [['المناسبة', oc.s], [oc.dead ? 'عن' : 'إلى', cleanName(st.to)], ['من', fromName(st)]].forEach(function (r) {
        var d = el('div'); d.appendChild(el('span', '', r[0])); d.appendChild(el('b', '', r[1])); sm.appendChild(d);
      });
      area.appendChild(sm);
      var e = el('div', 'mng-err'), b = el('button', 'mng-main', 'صحيح، اصنع بطاقتي'); b.type = 'button'; b.style.marginTop = '14px';
      area.appendChild(b); area.appendChild(e); e.style.textAlign = 'center';
      var ed = el('button', 'mng-main sec', 'عدّل الأسماء'); ed.type = 'button'; ed.style.marginTop = '10px';
      ed.onclick = function () { wizardScreen('edit', ''); }; area.appendChild(ed);
      b.onclick = function () { issue(b, e); };
      o.focusTitle();
    }
    /* الخطوتان 1 و2 فقط (بلا مبلغ): بلا اختيارات محفوظة، أو للبطاقة الثانية، أو عند «لا، أريد التعديل» */
    function wizardScreen(mode, errMsg) {
      area.innerHTML = '';
      var host = el('div'); area.appendChild(host);
      wizard(host, st, {shell:o, withAmount:false, pickProject:!st.p || !!st.forcePick, picked:picked || mode === 'edit', step:mode === 'edit' ? 2 : 1,
        doneText:'صحيح، اصنع بطاقتي', error:errMsg, onPick:function () { picked = true; },
        onDone:function (b, e) { issue(b, e); }});
    }
    function issue(b, e) {
      var label = b.textContent;
      b.disabled = true; b.textContent = 'نصنع بطاقتك… لا تغلق الصفحة';
      st.ns = autoNs(st.to); if (!hasF(OCC[st.o])) st.fem = false;
      post({a:'issue', order:order, p:st.p, o:st.o, d:st.d, th:st.th, ns:st.ns, fem:st.fem ? 1 : 0,
            anon:st.anon ? 1 : 0, from:cleanName(st.from), to:cleanName(st.to), dev:dev()})
        .then(function (r) {
          if (r && r.ok && r.code && r.img) {
            var d = ls('mn_gift_done'); if (!d || d.o !== order) d = {o:order, c:[]};
            if (d.c.indexOf(r.code) < 0) d.c.push(r.code); d.ts = Date.now(); d.t = d.t || {}; ls('mn_gift_done', d); done = d;
            ls('mn_gift', null); hasSaved = false; picked = true;
            result(st, r.code, r.img);
          } else fail(r && r.error);
        })
        .catch(function () { fail('net'); });
      function fail(code) {
        b.disabled = false; b.textContent = label;
        if (code === 'wrong_project') { st.p = ''; st.forcePick = 1; wizardScreen('', ERR[code]); return; }
        e.textContent = ERR[code] || ERR.server; e.style.display = 'block';
      }
    }
    function reopen(code) {
      body.innerHTML = ''; reset(); body.appendChild(el('div', 'mng-spin', 'لحظة…'));
      post({a:'card', c:code}).then(function (r) {
        if (r && r.ok && r.img) result(st, code, r.img, true);
        else { body.innerHTML = ''; body.appendChild(el('div', 'mng-err', ERR[r && r.error] || ERR.server)).style.display = 'block'; }
      }).catch(function () { body.innerHTML = ''; var x = el('div', 'mng-err', ERR.net); x.style.display = 'block'; body.appendChild(x); });
    }
    /* شاشة الإرسال */
    function result(st2, code, b64, old) {
      body.innerHTML = ''; reset(); o.setTitle('أرسل هديتك');
      var pName = PROJECTS[st2.p] || '', link0 = link(code);
      var saved2 = ls('mn_gift_done'), m = {body:'', noLink:false, lab:''}, haveCtx = !!(st2.p && st2.to), edited = false;
      var res = el('div', 'mng-res'), im = el('img'); im.src = 'data:image/png;base64,' + b64;
      im.alt = haveCtx ? cardAlt(st2.to, fromName(st2), OCC[st2.o] && OCC[st2.o].dead) : 'بطاقة الإهداء';
      res.appendChild(im); body.appendChild(res);
      if (old && saved2 && saved2.t && saved2.t[code]) {
        var tx = String(saved2.t[code]), ix = tx.indexOf(link0);
        if (ix >= 0) {
          var pre = tx.slice(0, ix), lm = pre.match(/\s*(بطاقتكِ|بطاقتك)\s*:\s*$/);
          m.lab = lm ? lm[1] : ''; m.body = (lm ? pre.slice(0, pre.length - lm[0].length) : pre).trim();
        } else { m.body = tx.trim(); m.noLink = true; }
      } else if (haveCtx) {
        m.body = (st2.edited && st2.msg ? st2.msg.trim() : autoMsg(st2, pName)); m.noLink = !!st2.noLink; m.lab = st2.fem ? LAB_F : LAB_M;
      } else m.body = 'وصلتك هدية خير عبر جمعية منارات مكة 🤍';
      function txt() { return (m.body.trim() + (m.noLink ? '' : '\n' + (m.lab ? m.lab + ': ' : '') + link0)).trim(); }
      function saveTxt() {
        var d = ls('mn_gift_done');
        if (d && d.c && d.c.indexOf(code) >= 0) { d.t = d.t || {}; d.t[code] = txt(); ls('mn_gift_done', d); done = d; }
      }
      if (!old) saveTxt();
      o.allowClose(); later.style.setProperty('display', 'none', 'important');

      /* صندوق الرسالة: ما سيُرسل مع البطاقة، و«تعديل» يفتح خانة الكتابة تحته */
      var mb = el('div', 'mng-mbox'), mtop = el('div', 'top');
      mtop.appendChild(el('small', '', 'الرسالة في واتساب مع البطاقة'));
      var mt = el('button', 'mng-lk', 'تعديل'); mt.type = 'button'; mt.setAttribute('aria-expanded', 'false'); mtop.appendChild(mt);
      var mp = el('p'), mln = el('div', 'ln');
      mb.appendChild(mtop); mb.appendChild(mp); mb.appendChild(mln); body.appendChild(mb);
      function showMsg() {
        mp.textContent = m.body.trim();
        mln.innerHTML = '';
        if (m.noLink) { mln.textContent = 'لن يُضاف الرابط، ويبقى الباركود داخل البطاقة لفتحها.'; return; }
        if (m.lab) mln.appendChild(document.createTextNode(m.lab + ': '));
        var bd = document.createElement('bdi'); bd.setAttribute('dir', 'ltr'); bd.textContent = link0.replace(/^https:\/\//, ''); mln.appendChild(bd);
      }
      var box = el('div'); box.style.display = 'none'; body.appendChild(box);
      var ta = el('textarea', 'mng-inp'); ta.rows = 4; ta.maxLength = 300; ta.value = m.body; ta.style.marginTop = '8px';
      ta.setAttribute('aria-label', 'نص الرسالة'); box.appendChild(ta);
      var rowH = el('div', 'mng-hint mng-ehint'), cnt = el('span'), rst = el('button', 'mng-lk', 'إرجاع النص المقترح'); rst.type = 'button';
      rowH.appendChild(cnt); if (haveCtx) rowH.appendChild(rst); box.appendChild(rowH);
      var lkL = el('label', 'mng-chk'), lkIn = el('input'); lkIn.type = 'checkbox'; lkIn.checked = !m.noLink;
      lkL.appendChild(lkIn); lkL.appendChild(document.createTextNode('أضِف رابط البطاقة في آخر الرسالة')); box.appendChild(lkL);
      function upd() { cnt.textContent = ta.value.length + ' / 300'; showMsg(); }
      upd();
      ta.oninput = function () { m.body = ta.value; edited = true; upd(); saveTxt(); };
      rst.onclick = function () { m.body = autoMsg(st2, pName); ta.value = m.body; edited = false; upd(); saveTxt(); };
      lkIn.onchange = function () { m.noLink = !lkIn.checked; if (!m.noLink && !m.lab) m.lab = st2.fem ? LAB_F : LAB_M; upd(); saveTxt(); };
      mt.onclick = function () {
        var open = box.style.display === 'none'; box.style.display = open ? 'block' : 'none';
        mt.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) { try { ta.focus(); } catch (z) {} }
      };

      var file = null; try { file = new File([b64Blob(b64)], 'hadiya-' + code + '.png', {type:'image/png'}); } catch (z) {}
      var wa = el('button', 'mng-main wa', 'أرسل في واتساب'); wa.type = 'button'; wa.style.marginTop = '12px';
      wa.insertAdjacentHTML('afterbegin', waIcon('#fff')); body.appendChild(wa);
      var tip = el('div', 'mng-note', 'نسخنا نص الرسالة لك. إن وصلت الصورة بلا نص في واتساب، ألصقه في المحادثة.'); tip.style.display = 'none'; body.appendChild(tip);
      wa.onclick = function () {
        ev('sent_whatsapp'); var t = txt();
        if (file && navigator.canShare && isMobile() && navigator.canShare({files:[file]})) {
          try { navigator.clipboard && navigator.clipboard.writeText(t).catch(function () {}); } catch (z) {}
          navigator.share({files:[file], text:t}).catch(function () {});
          tip.style.display = 'block';
        } else window.open('https://wa.me/?text=' + encodeURIComponent(t.indexOf(link0) >= 0 ? t : t + '\n' + link0), '_blank');
      };
      var two = el('div', 'mng-two'); body.appendChild(two);
      var sv = el('a', 'mng-main sec', 'احفظ الصورة');
      sv.href = 'data:image/png;base64,' + b64; sv.download = 'hadiya-' + code + '.png';
      two.appendChild(sv);
      var cp = el('button', 'mng-main sec'); cp.type = 'button'; var cpS = el('span', '', 'انسخ الرسالة'); cpS.setAttribute('aria-live', 'polite'); cp.appendChild(cpS); two.appendChild(cp);
      cp.onclick = function () {
        ev('copy_msg'); var t = txt();
        var ok = function () { cpS.textContent = 'تم النسخ ✓'; setTimeout(function () { cpS.textContent = 'انسخ الرسالة'; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, function () {}); else { var ta0 = el('textarea'); ta0.value = t; document.body.appendChild(ta0); ta0.select(); try { document.execCommand('copy'); ok(); } catch (z) {} ta0.remove(); }
      };
      /* زر الحفظ لا يعمل داخل متصفح سناب وتيك توك وإنستقرام: الضغط المطوّل على الصورة يعمل في كل المتصفحات */
      var lp = el('div', 'mng-note', 'أو اضغط مطوّلاً على الصورة ثم احفظها.'); lp.style.display = 'none';
      sv.onclick = function () { ev('save_img'); lp.style.display = 'block'; };
      body.appendChild(lp);
      if (isMobile() && st2.p && !old) {
        var sms = el('a', 'mng-lk', 'أو ارسل برسالة نصية');
        sms.href = 'sms:?&body=' + encodeURIComponent(smsMsg(st2, pName, code));
        /* إن عدّل المتبرع الكلام فالرسالة النصية تحمل كلامه ورابط البطاقة */
        sms.onclick = function () { ev('sent_sms'); sms.href = 'sms:?&body=' + encodeURIComponent(edited ? m.body.trim() + '\n' + (m.lab ? m.lab + ': ' : '') + link0 : smsMsg(st2, pName, code)); };
        body.appendChild(sms);
      }
      if (done && done.o === order && done.c.length < 2) {
        body.appendChild(el('div', 'mng-hr'));
        var more = el('button', 'mng-lk', 'بطاقة ثانية لشخص آخر (بلا تبرع جديد)'); more.type = 'button';
        more.onclick = function () { start(); }; body.appendChild(more);
      }
      body.appendChild(el('div', 'mng-small', 'رابط البطاقة يعمل 90 يوماً، فاحفظ الصورة. · الرمز ' + code.slice(0, 4) + '-' + code.slice(4)));
      o.focusTitle();
    }
    start();
  }
  var ERR = {
    not_paid: 'لم يتأكد الدفع بعد. انتظر دقيقة ثم أعد المحاولة.',
    not_found: 'لم نجد التبرع. تأكد من الرابط، أو انتظر دقيقة ثم أعد المحاولة.',
    wrong_project: 'هذا التبرع ليس للمشروع المختار. اختر المشروع الصحيح.',
    max: 'أصدرت بطاقتين لهذا التبرع، وهو الحد الأعلى.',
    locked: 'محاولات كثيرة. حاول بعد ساعة.',
    review: 'لم نتمكن من إصدار البطاقة بهذا الاسم. اكتب الاسم بطريقة أخرى، أو تواصل مع الجمعية.',
    busy: 'البطاقة قيد التجهيز. انتظر دقيقة ثم أعد المحاولة.',
    paused: 'الإهداء متوقف مؤقتاً. حاول لاحقاً.',
    bad_name: 'الأسماء حروف فقط، حتى 25 حرفاً.',
    bad_order: 'رابط التبرع غير صحيح.',
    unavailable: 'هذه البطاقة غير متاحة.',
    net: 'تعذّر الاتصال. تأكد من الإنترنت ثم أعد المحاولة.',
    server: 'حدث خطأ. أعد المحاولة بعد قليل.'
  };

  /* ===================== 4) صفحة المُهدى إليه ===================== */
  function recipient(code) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    ev('recipient_open');
    /* العنوان يبدأ «بطاقة خير» ثم يصير «هدية خير» ما لم تكن البطاقة صدقة عن متوفى */
    var o = overlay('وصلتك بطاقة خير'), body = o.body, ttl = $('h3', o.ov);
    function oops(msg) {
      body.innerHTML = '';
      body.appendChild(el('div', 'mng-dua', msg));
      var rb = el('button', 'mng-main sec', 'أعد المحاولة'); rb.type = 'button'; rb.onclick = load; body.appendChild(rb);
      var pl = el('a', 'mng-lk', 'تصفّح مشاريع الجمعية'); pl.href = '/products'; body.appendChild(pl);
    }
    function load() {
      body.innerHTML = '';
      body.appendChild(el('div', 'mng-spin', 'نفتح البطاقة…'));
      post({a:'card', c:code}).then(function (r) {
        body.innerHTML = '';
        if (ttl && !(r && r.ok && r.dead)) ttl.textContent = 'وصلتك هدية خير';
        if (!r || !r.ok) { oops(ERR[r && r.error] || ERR.unavailable); return; }
        var slug = hasP(r.p) ? r.p : '', pName = PROJECTS[slug] || '';
        var who = r.from && String(r.from).trim() !== 'فاعل خير' ? String(r.from).trim() : '';
        if (r.expired) {
          body.appendChild(el('div', 'mng-dua', 'انتهت مدة عرض هذه البطاقة. جزى الله من أهداها خيراً.'));
        } else {
          var res = el('div', 'mng-res'), im = el('img'); im.src = 'data:image/png;base64,' + r.img; im.alt = r.to ? cardAlt(r.to, r.from, r.dead) : 'بطاقة الإهداء';
          res.appendChild(im); body.appendChild(res);
          if (!r.dead && pName) body.appendChild(el('p', 'mng-say', who ? 'أهدى لك ' + who + ' أجر مشروع «' + pName + '» بمكة المكرمة.' : 'وصلك أجر مشروع «' + pName + '» بمكة المكرمة.'));
          body.appendChild(el('p', 'mng-ask', who ? 'شارك في عمارة بيوت الله كما شارك ' + who + '.' : 'شارك في عمارة بيوت الله.'));
        }
        if (slug) {
          /* الأهم أولاً: التبرع. ثم الشكر بإطار، ثم رابطان */
          var d = el('a', 'mng-main', 'تبرّع أنت أيضاً'); d.href = '/products/' + slug;
          d.onclick = function () { ev('recipient_donate'); }; body.appendChild(d);
          if (!r.expired && r.from && !r.dead) {
            var t = el('a', 'mng-main thx', 'اشكر ' + r.from + ' في واتساب'); t.insertAdjacentHTML('afterbegin', waIcon('#25D366'));
            t.href = 'https://wa.me/?text=' + encodeURIComponent('جزاك الله خيراً يا ' + r.from + ' على إهدائي أجر «' + pName + '» لمساجد مكة 💚');
            t.target = '_blank'; t.rel = 'noopener'; t.onclick = function () { ev('thank_click'); }; body.appendChild(t);
          }
        }
        var lks = el('div', 'mng-lks');
        if (!r.expired && r.img) {
          var sv = el('a', 'mng-lk', 'احفظ البطاقة'); sv.href = 'data:image/png;base64,' + r.img; sv.download = 'hadiya-' + code + '.png';
          sv.onclick = function () { ev('save_img'); }; lks.appendChild(sv);
        }
        if (slug) {
          var g = el('a', 'mng-lk', 'أهدِ من تحب'); g.href = '/products/' + slug + '#hadiya-open';
          g.onclick = function () { ev('recipient_gift'); }; lks.appendChild(g);
        }
        if (lks.children.length) body.appendChild(lks);
        body.appendChild(el('div', 'mng-small', 'بطاقة إهداء، وليست إيصال تبرع · الرمز ' + code.slice(0, 4) + '-' + code.slice(4) + ' · جمعية منارات مكة للعناية بالمساجد'));
      }).catch(function () { oops(ERR.net); });
    }
    load();
  }

  /* ===================== صفحة الشكر ===================== */
  function thanksPage(order) {
    ls('mn_gift_ord', {c:order, ts:Date.now()});
    var saved = ls('mn_gift');
    var dn = ls('mn_gift_done'), red = ls('mn_gift_redir');
    var already = (dn && dn.o === order) || (red && red.c === order);
    if (saved && Date.now() - saved.ts < KEEP_MS && !already) {
      var h = overlay('شكراً لتبرعك 🤍', true);
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