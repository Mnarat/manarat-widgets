/* receipts-fast.js — منارات (2026-11-26)
   يُحمَّل من «تعديل JS» في زد مع manarat-widgets.js، ويعمل وحده بلا انتظاره.
   يحقن تصميم «طلباتي وإيصالاتي» ويبدّل النصوص فوراً، ويحمّل receipt.js مباشرة من المجلد نفسه (نفس رقم الـcommit). */
(function(){
  try {
    var cs = document.currentScript, SRC = (cs && cs.src) || '';
    var base = SRC.replace(/receipts-fast\.js.*$/, '');
    if (!base) return;
    var p = location.pathname, h = location.hash || '';
    var isOrders = p === '/account-orders';
    var isInv = /^\/(o\/[A-Za-z0-9]{6,24}\/inv|(order-completed|orders)\/[A-Za-z0-9]{6,24}\/invoice)/.test(p);
    if (!isOrders && !isInv && h.indexOf('#receipt=') !== 0) return;

    /* 0) التنسيق والإخفاء من أول لحظة */
    var st = document.createElement('style'); st.id = 'mn-fast-css'; st.textContent = "@keyframes mnShow{to{visibility:visible}}\nhtml:not(.mn-ord-ok) table.order-table,html:not(.mn-ord-ok) body:has(table.order-table) h1:not(.search-seo){visibility:hidden;animation:mnShow 0s 1s forwards}\nbody:has(table.order-table) #quickDonationFab,body:has(.z-order-invoice-view) #quickDonationFab,body:has(.order-completed-content) #quickDonationFab{display:none!important}\nbody:has(.z-order-invoice-view) [id^=\"mazeedplus\"],body:has(.order-completed-content) [id^=\"mazeedplus\"]{display:none!important}\na.footer-marketing-link{display:none!important}\ntable.order-table td.order-action .mnr-rbtn.mnr-pend{visibility:hidden}\ntable.order-table td.order-action{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}table.order-table td.order-action a.btn,table.order-table td.order-action .mnr-rbtn{box-sizing:border-box;display:inline-flex!important;align-items:center;justify-content:center;gap:6px;width:120px;height:40px!important;margin:6px 0 0!important;padding:0 10px!important;border-radius:10px!important;font-size:15px!important;font-weight:700!important;text-decoration:none!important;line-height:1!important;cursor:pointer}table.order-table td.order-action a.btn{background:#fff!important;color:#052560!important;border:2px solid #052560!important}table.order-table td.order-action .mnr-rbtn{background:#052560!important;color:#fff!important;border:2px solid #052560!important;font-family:inherit}@media (max-width:767px){table.order-table,table.order-table tbody{display:block!important;width:100%!important;border:0!important}table.order-table tbody tr{display:grid!important;grid-template-columns:1fr auto;grid-template-areas:\"num st\" \"dt tot\" \"act act\";gap:8px 10px;align-items:center;background:#fff;border:1px solid #E1E3E3!important;border-radius:14px;padding:14px!important;margin:0 0 12px!important;box-shadow:0 1px 3px rgba(5,37,96,.06)}table.order-table tbody tr td{display:block!important;width:auto!important;padding:0!important;border:0!important;text-align:right!important}table.order-table td.order-status::before,table.order-table td.order-date::before,table.order-table td.order-total::before,table.order-table td.order-action::before,table.order-table td.order-date::after,table.order-table td.order-total::after{display:none!important;content:none!important}table.order-table td.order-number{grid-area:num;display:flex!important;direction:rtl!important;align-items:center!important;gap:6px;justify-content:flex-start;font-size:16px;font-weight:700}table.order-table td.order-number::before{content:\"رقم التبرع\"!important;font-weight:400;font-size:13px;color:#3A4247;width:auto!important;min-width:0!important;max-width:none!important;padding:0!important;margin:0!important;text-align:right!important;flex:none!important;position:relative!important;top:-2px!important;line-height:1.2!important;display:block!important}table.order-table td.order-number a{direction:ltr;position:relative;top:1px}table.order-table td.order-status{grid-area:st;justify-self:end;width:max-content!important;min-width:0!important;max-width:none!important;height:26px;display:flex!important;align-items:center;justify-content:center;line-height:1!important;box-sizing:border-box;padding:0 12px .5px!important;font-size:13px!important;font-weight:700;border-radius:999px;text-align:center!important}table.order-table td.mnr-st-ok{background:#CFEDEA;color:#052560}table.order-table td.mnr-st-wait{background:#F1F3F5;color:#3A4247}table.order-table td.order-date{grid-area:dt;font-size:13px;color:#3A4247}table.order-table td.order-total{grid-area:tot;justify-self:end;font-size:17px;font-weight:800;color:#052560}table.order-table td.order-action{grid-area:act;display:flex!important;gap:8px;flex-wrap:nowrap!important;padding-top:4px!important}table.order-table td.order-action a.btn,table.order-table td.order-action .mnr-rbtn{flex:1 1 0;width:auto!important;margin:0!important;height:42px!important}table.order-table td.order-action a.btn{padding:0 10px!important}table.order-table td.order-action .mnr-wait{flex:1 1 0;width:auto!important;margin:0!important;height:42px!important}}table.order-table td.order-action .mnr-wait{box-sizing:border-box;display:inline-flex!important;align-items:center;justify-content:center;width:120px;height:40px;margin:6px 0 0;padding:2px 10px 0;border-radius:10px;background:#F1F3F5;color:#3A4247;font-size:15px;font-weight:700;line-height:1;cursor:default;font-family:inherit}";
    (document.head || document.documentElement).appendChild(st);

    /* 1) receipt.js مباشرة، بدل انتظار manarat-widgets.js (الذي يتركه لأن id موجود) */
    if (!document.getElementById('mn-receipt-js')) {
      var r = document.createElement('script');
      r.id = 'mn-receipt-js'; r.async = true;
      r.src = base + 'receipt.js';
      (document.head || document.documentElement).appendChild(r);
    }
    if (!isOrders) return;

    /* 2) «طلباتي وإيصالاتي» فوراً */
    var ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/></svg>';
    var ready = function () { document.documentElement.classList.add('mn-ord-ok'); };
    var openR = function (o, b) {
      if (window.MNReceipt) { window.MNReceipt.open(o); return; }
      var t0 = b.innerHTML, n = 0; b.disabled = true; b.textContent = 'لحظة…';
      var iv = setInterval(function () {
        if (window.MNReceipt || ++n > 40) { clearInterval(iv); b.disabled = false; b.innerHTML = t0; if (window.MNReceipt) window.MNReceipt.open(o); }
      }, 250);
    };
    var fill = function () {
      var hs = document.querySelectorAll('h1');
      for (var k = 0; k < hs.length; k++) if ((hs[k].textContent || '').trim() === 'طلباتي') hs[k].textContent = 'طلباتي وإيصالاتي';
      var rows = document.querySelectorAll('table.order-table tbody tr');
      for (var j = 0; j < rows.length; j++) (function (tr) {
        var st = tr.querySelector('td.order-status');
        if (st && (st.textContent || '').trim() === 'تم التوصيل') st.textContent = 'تم التبرع';
        if (st) { var ok = (st.textContent || '').trim() === 'تم التبرع'; st.classList.toggle('mnr-st-ok', ok); st.classList.toggle('mnr-st-wait', !ok); }
        if (tr.querySelector('.mnr-rbtn,.mnr-wait')) return;
        var a = null, as = tr.querySelectorAll('a');
        for (var i = 0; i < as.length; i++) if (/\/invoice/.test(as[i].getAttribute('href') || '')) { a = as[i]; break; }
        var m = a && (a.getAttribute('href') || '').match(/\/(?:order-completed|orders)\/([A-Za-z0-9]{6,24})\/invoice/);
        if (!m) return;
        var o = m[1], b = document.createElement('button');
        b.type = 'button'; b.className = 'mnr-rbtn mnr-pend';
        b.innerHTML = ICON + 'الإيصال';
        b.onclick = function () { openR(o, b); };
        a.parentNode.appendChild(b);
        var shown = setTimeout(function () { b.classList.remove('mnr-pend'); }, 1500);   /* حد أقصى للانتظار */
        /* تبرع غير مدفوع: «بانتظار الدفع» بدل «الإيصال»؛ إن فشل الطلب يبقى الزر */
        fetch('/api/v1/orders/' + o + '/invoice', {credentials: 'same-origin', headers: {Accept: 'application/json'}})
          .then(function (x) { return x.json(); }).then(function (jj) {
            var od = jj && (jj.order || (jj.data && jj.data.order));
            if (od && String(od.payment_status || '').toLowerCase() !== 'paid' && b.isConnected) {
              var w = document.createElement('span'); w.className = 'mnr-wait'; w.textContent = 'بانتظار الدفع'; b.replaceWith(w);
            }
          }).catch(function () {}).then(function () { clearTimeout(shown); b.classList.remove('mnr-pend'); });
      })(rows[j]);
      if (rows.length || document.readyState !== 'loading') ready();
    };
    fill();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
    var tm = 0, mo = new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(fill, 50); });
    mo.observe(document.body || document.documentElement, {childList: true, subtree: true});
    setTimeout(function () { ready(); }, 1000);          /* لا تبقى الصفحة مخفية مهما حدث */
    setTimeout(function () { mo.disconnect(); }, 15000);
  } catch (e) { document.documentElement.classList.add('mn-ord-ok'); }
})();
