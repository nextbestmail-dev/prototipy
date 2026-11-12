// МАРТдекор: меню, появление при прокрутке, параллакс, фильтр проектов, FAQ, формы
(function () {
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.documentElement.classList.add('js');

  // Шапка и нижняя панель
  var hdr = d.querySelector('.hdr'), bar = d.querySelector('.mbar');
  function onScroll() {
    var y = scrollY;
    if (hdr) hdr.classList.toggle('scrolled', y > 8);
    if (bar) bar.classList.toggle('show', y > 520 && (innerHeight + y) < d.body.scrollHeight - 220);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Мобильное меню
  var burger = d.querySelector('.burger'), mnav = d.getElementById('mnav');
  if (burger && mnav) {
    function setMenu(open) {
      mnav.hidden = !open; burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      burger.innerHTML = open ? '<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' : '<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>';
      d.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setMenu(mnav.hidden); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); burger.focus(); } });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  // Появление при прокрутке
  var els = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px 6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  // Лёгкий параллакс
  var par = d.querySelectorAll('.parallax img');
  if (par.length && !reduce) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        par.forEach(function (im) {
          var r = im.parentNode.getBoundingClientRect(), k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          im.style.transform = 'translateY(' + (k * -24).toFixed(1) + 'px) scale(1.08)';
        });
        tick = false;
      });
    }, { passive: true });
  }

  // FAQ: одна открытая панель
  var faqs = d.querySelectorAll('details.faq');
  faqs.forEach(function (x) { x.addEventListener('toggle', function () { if (x.open) faqs.forEach(function (y) { if (y !== x) y.open = false; }); }); });

  // Фильтр проектов
  var chips = d.querySelectorAll('[data-filter]'), grid = d.querySelector('[data-grid]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter'), n = 0;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
      grid.querySelectorAll('.pcard').forEach(function (card) {
        var ok = f === 'all' || card.getAttribute('data-cats').split(' ').indexOf(f) >= 0;
        card.hidden = !ok; if (ok) { n++; card.classList.add('in'); }
      });
      grid.querySelector('.empty').hidden = n > 0;
    });
  });

  // Вкладки «С чем вы придёте»
  var entry = d.getElementById('entry');
  if (entry) {
    var tabs = entry.querySelectorAll('[data-entry]');
    function pickTab(b) {
      tabs.forEach(function (x) { var on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      d.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== b.getAttribute('data-entry'); });
    }
    entry.addEventListener('click', function (e) { var b = e.target.closest('[data-entry]'); if (b) pickTab(b); });
    entry.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var a = Array.prototype.indexOf.call(tabs, d.activeElement); if (a < 0) return;
      var n = tabs[(a + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pickTab(n); n.focus();
    });
  }

  // Эскиз → интерьер
  d.querySelectorAll('.cmp').forEach(function (c) {
    var r = c.querySelector('.cmp-range');
    r.addEventListener('input', function () { c.style.setProperty('--pos', r.value + '%'); });
  });

  // Другие интерьеры для сравнения
  d.querySelectorAll('.cmp-t').forEach(function (t) {
    t.addEventListener('click', function () {
      var w = t.closest('.cmp-wrap'), c = w.querySelector('.cmp'), ph = w.querySelector('[data-cmp-ph]'), sk = w.querySelector('[data-cmp-sk]');
      ph.removeAttribute('srcset'); sk.removeAttribute('srcset');
      ph.src = t.getAttribute('data-ph'); sk.src = t.getAttribute('data-sk');
      ph.alt = 'Интерьер: ' + t.textContent.trim();
      c.style.setProperty('--pos', '50%'); c.querySelector('.cmp-range').value = 50;
      w.querySelectorAll('.cmp-t').forEach(function (x) { x.setAttribute('aria-pressed', x === t); });
    });
  });

  // Галерея: просмотр фото
  var lb = d.querySelector('.lb'), gl = d.querySelectorAll('.gl-i'), gi = 0;
  if (lb && gl.length && lb.showModal) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption span'), lbLink = lb.querySelector('figcaption a');
    function showLb(n) {
      gi = (n + gl.length) % gl.length; var a = gl[gi], im = a.querySelector('img');
      lbImg.src = a.getAttribute('href'); lbImg.alt = im.alt; lbCap.textContent = im.alt; lbLink.href = a.getAttribute('data-href');
    }
    gl.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); showLb(i); lb.showModal(); }); });
    lb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lb]');
      if (b) { var v = b.getAttribute('data-lb'); if (v === 'x') lb.close(); else showLb(gi + +v); }
      else if (e.target === lb) lb.close();
    });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') showLb(gi + 1); if (e.key === 'ArrowLeft') showLb(gi - 1); });
  }


  // Лента материалов: медленно едет сама, её можно листать мышкой (перетаскиванием), пальцем и тачпадом
  var ts = d.querySelector('.tex-scroll');
  if (ts) {
    var tt = ts.firstElementChild, half = 0, pos = 0, hold = false, dragging = false, resumeAt = 0, last = 0, sx = 0, sl = 0, moved = 0;
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function measure() { half = tt.scrollWidth / 2; }
    function wrap() { if (!half) return; if (ts.scrollLeft < 4) { ts.scrollLeft += half; pos = ts.scrollLeft; } else if (ts.scrollLeft > half * 2 - ts.clientWidth - 4) { ts.scrollLeft -= half; pos = ts.scrollLeft; } }
    function pause(ms) { resumeAt = Date.now() + (ms || 0); }
    measure(); addEventListener('resize', measure); addEventListener('load', measure);
    ts.addEventListener('scroll', function () { wrap(); if (hold || dragging || Date.now() < resumeAt) pos = ts.scrollLeft; });
    ts.addEventListener('mouseenter', function () { hold = true; });
    ts.addEventListener('mouseleave', function () { hold = false; pause(600); });
    ts.addEventListener('touchstart', function () { hold = true; }, { passive: true });
    ts.addEventListener('touchend', function () { hold = false; pause(2500); }, { passive: true });
    ts.addEventListener('wheel', function () { pause(1500); }, { passive: true });
    ts.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; dragging = true; moved = 0; sx = e.clientX; sl = ts.scrollLeft; e.preventDefault(); });
    addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 4) ts.classList.add('drag'); ts.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!dragging) return; dragging = false; setTimeout(function () { ts.classList.remove('drag'); }, 0); pause(800); });
    ts.addEventListener('click', function (e) { if (moved > 4) { e.preventDefault(); moved = 0; } }, true);
    ts.addEventListener('dragstart', function (e) { e.preventDefault(); });
    ts.scrollLeft = 8; pos = ts.scrollLeft;
    function step(t) {
      var dt = last ? Math.min(t - last, 50) : 0; last = t;
      if (!still && !hold && !dragging && Date.now() >= resumeAt && half) {
        pos += dt * 0.04;
        if (pos > half * 2 - ts.clientWidth - 4) pos -= half;
        ts.scrollLeft = pos;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  // Заголовки без переносов: если длинное слово не помещается в ширину (телефон), чуть уменьшаем шрифт заголовка
  function fitHeads() {
    d.querySelectorAll('h1, h2').forEach(function (h) {
      h.style.fontSize = '';
      var fs = parseFloat(getComputedStyle(h).fontSize), n = 0;
      while (h.scrollWidth > h.clientWidth + 1 && fs > 16 && n < 40) { fs -= 1; h.style.fontSize = fs + 'px'; n++; }
    });
  }
  fitHeads();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(fitHeads);
  addEventListener('load', fitHeads);
  var fitT; addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(fitHeads, 150); });

  // Отзывы
  var slides = d.querySelectorAll('[data-slide]'), simgs = d.querySelectorAll('[data-slide-img]'), dots = d.querySelectorAll('.rv-dots i'), cur = 0;
  function showRv(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.hidden = i !== cur; });
    simgs.forEach(function (s, i) { s.hidden = i !== cur; });
    dots.forEach(function (s, i) { s.classList.toggle('on', i === cur); });
  }
  if (slides.length) { showRv(0); d.querySelectorAll('[data-rv]').forEach(function (b) { b.addEventListener('click', function () { showRv(cur + +b.getAttribute('data-rv')); }); }); }

  // Подборка: хранится только в браузере посетителя
  var KEY = 'martdecor-podborka', mem = {};
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return mem; } }
  function save(v) { mem = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} badge(); }
  function badge() {
    var p = load(), n = Object.keys(p).length;
    d.querySelectorAll('.js-count').forEach(function (e) { e.textContent = n; e.hidden = !n; });
    d.querySelectorAll('[data-add]').forEach(function (b) {
      var on = b.getAttribute('data-add') in p;
      b.setAttribute('aria-pressed', on);
      b.querySelector('span').textContent = on ? 'В подборке' : 'В подборку';
    });
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var p = load(), id = b.getAttribute('data-add');
    if (p[id] !== undefined) delete p[id]; else p[id] = '';
    save(p);
  });
  badge();

  var pod = d.getElementById('pod'), ITEMS = window.MD_ITEMS || [];
  function item(id) { return ITEMS.filter(function (i) { return i.id === id; })[0]; }
  function escH(s) { var x = d.createElement('div'); x.textContent = s; return x.innerHTML; }
  function drawPod() {
    if (!pod) return;
    var p = load(), ids = Object.keys(p).filter(item), rel = pod.getAttribute('data-rel');
    if (!ids.length) {
      pod.innerHTML = '<div class="pod-empty"><p>Пока пусто. Добавьте материалы из каталога или просто пришлите проект: менеджер соберёт подборку сам.</p><a class="btn btn-dark" href="' + rel + 'catalog/"><span>Открыть каталог</span></a></div>';
      return;
    }
    pod.innerHTML = ids.map(function (id) {
      var i = item(id);
      return '<div class="pod-row"><img src="' + rel + i.img + '" alt="" width="88" height="88" loading="lazy"><div><p class="eyebrow">' + escH(i.brand + ' · ' + i.cat) + '</p><a href="' + rel + i.href + '">' + escH(i.name) + '</a>' +
        '<label class="sr" for="q-' + id + '" style="position:absolute;left:-9999px">Сколько нужно</label><input id="q-' + id + '" data-q="' + id + '" value="' + escH(p[id] || '') + '" placeholder="Сколько нужно: м², рулоны, штуки"></div>' +
        '<button type="button" class="pod-x" data-x="' + id + '" aria-label="Убрать из подборки"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>';
    }).join('') + '<p class="pod-sum">В подборке: ' + ids.length + '. Цену и наличие менеджер проверит перед счётом.</p>';
  }
  if (pod) {
    pod.addEventListener('click', function (e) { var b = e.target.closest('[data-x]'); if (b) { var p = load(); delete p[b.getAttribute('data-x')]; save(p); drawPod(); } });
    pod.addEventListener('input', function (e) { var q = e.target.getAttribute('data-q'); if (q) { var p = load(); p[q] = e.target.value; save(p); } });
    drawPod();
  }
  function pickText() {
    var p = load(), ids = Object.keys(p).filter(item);
    if (!ids.length) return '';
    return '\nПодборка:\n' + ids.map(function (id) { var i = item(id); return '— ' + i.brand + ', ' + i.name + (p[id] ? ': ' + p[id] : ''); }).join('\n');
  }

  // Формы: проверка, отправка на endpoint или подготовка сообщения в WhatsApp
  d.querySelectorAll('form[data-form]').forEach(function (f) {
    var state = f.querySelector('.form-state'), btn = f.querySelector('button[type=submit]');
    function show(el, bad) { var e = el.closest('.fld') ? el.closest('.fld').querySelector('.err') : f.querySelector('.err-agree'); if (e) e.hidden = !bad; el.setAttribute('aria-invalid', bad); }
    // Телефон: маска +7 (999) 123-45-67, восьмёрка в начале превращается в +7
    var telIn = f.elements.tel;
    function telDigits(v) { var d = v.replace(/\D/g, ''); if (!d) return ''; if (d[0] === '8') d = '7' + d.slice(1); else if (d[0] !== '7') d = '7' + d; return d.slice(0, 11); }
    function telFmt(d) { if (!d) return ''; var r = '+7'; if (d.length > 1) r += ' (' + d.slice(1, 4); if (d.length >= 4) r += ')'; if (d.length > 4) r += ' ' + d.slice(4, 7); if (d.length > 7) r += '-' + d.slice(7, 9); if (d.length > 9) r += '-' + d.slice(9, 11); return r; }
    telIn.addEventListener('input', function (e) { if (e.inputType && e.inputType.indexOf('delete') === 0) return; telIn.value = telFmt(telDigits(telIn.value)); });
    telIn.addEventListener('focus', function () { if (!telIn.value) telIn.value = '+7 ('; });
    telIn.addEventListener('blur', function () { if (telDigits(telIn.value).length <= 1) telIn.value = ''; });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = f.elements.name, tel = telIn, topic = f.elements.topic, msg = f.elements.msg, agree = f.elements.agree, ok = true;
      function need(el, bad) { show(el, bad); if (bad) ok = false; }
      need(name, name.value.trim().length < 2);
      need(tel, telDigits(tel.value).length !== 11);
      need(topic, !topic.value);
      need(msg, msg.value.trim().length < 3);
      need(agree, !agree.checked);
      if (!ok) { state.className = 'form-state fail'; state.textContent = 'Заполните отмеченные поля.'; f.querySelector('[aria-invalid="true"]').focus(); return; }
      tel.value = telFmt(telDigits(tel.value));
      var text = 'Заявка с сайта МАРТдекор\nИмя: ' + name.value.trim() + '\nТелефон: ' + tel.value.trim() + '\n' + topic.labels[0].textContent + ': ' + topic.value + '\nКомментарий: ' + msg.value.trim() + (f.hasAttribute('data-pick') ? pickText() : '');
      var endpoint = f.getAttribute('data-endpoint');
      if (endpoint) {
        btn.disabled = true; state.className = 'form-state'; state.textContent = 'Отправляем…';
        var data = new FormData(f);
        data.append('forma', (f.querySelector('.form-h') || {}).textContent || 'Заявка');
        data.append('stranica', location.href);
        if (f.hasAttribute('data-pick')) data.append('pick', pickText().split('\n').slice(2).join('\n'));
        fetch(endpoint, { method: 'POST', body: data })
          .then(function (r) { return r.json(); })
          .then(function (j) { if (!j || !j.ok) throw 0; state.className = 'form-state ok'; state.textContent = 'Спасибо! Заявка отправлена, менеджер свяжется с вами в рабочее время.'; f.reset(); state.scrollIntoView({ block: 'center', behavior: 'smooth' }); })
          .catch(function () { state.className = 'form-state fail'; state.innerHTML = 'Не получилось отправить. Позвоните нам или <a target="_blank" rel="noopener" href="https://wa.me/' + f.getAttribute('data-wa') + '?text=' + encodeURIComponent(text) + '">напишите в WhatsApp</a>.'; })
          .finally(function () { btn.disabled = false; });
      } else {
        // Сервер приёма заявок ещё не подключён: честно предлагаем отправить готовый текст в мессенджер
        var url = 'https://wa.me/' + f.getAttribute('data-wa') + '?text=' + encodeURIComponent(text);
        state.className = 'form-state ok';
        state.innerHTML = 'Сообщение подготовлено. <a target="_blank" rel="noopener" href="' + url + '">Отправить его в WhatsApp</a> — менеджер ответит в рабочее время.';
        state.querySelector('a').focus();
      }
    });
  });

  // Переход с бренда: в разделе каталога показываем только товары этого бренда
  var bf = d.querySelector('.bf'), qs = new URLSearchParams(location.search), brand = qs.get('brand');
  if (bf && brand) {
    var shop = qs.get('shop'), low = brand.toLowerCase(), items = [].slice.call(d.querySelectorAll('.items .item'));
    var hits = items.filter(function (it) { return (it.getAttribute('data-brand') || '').toLowerCase() === low; });
    var nameEl = bf.querySelector('.bf-name'), note = bf.querySelector('.bf-note'), sh = bf.querySelector('.bf-shop'), all = bf.querySelector('.bf-all');
    nameEl.textContent = brand;
    if (hits.length) {
      items.forEach(function (it) { it.hidden = hits.indexOf(it) < 0; it.classList.add('in'); });
      note.textContent = hits.length === 1 ? 'Здесь показан один пример. Остальное — в онлайн-каталоге или по запросу.' : 'Здесь показаны примеры этого бренда (' + hits.length + '). Остальное — в онлайн-каталоге или по запросу.';
    } else {
      all.hidden = true;
      note.textContent = 'Примеров этого бренда на сайте пока нет, но его материалы есть в салоне. Пришлите проект или фото: подберём подходящие варианты.';
    }
    if (shop) {
      sh.href = 'https://martdecor.online/?post_type=product&s=' + encodeURIComponent(shop);
      sh.querySelector('span').textContent = 'Все товары ' + brand + ' в онлайн-каталоге';
      sh.hidden = false;
    }
    all.addEventListener('click', function () {
      items.forEach(function (it) { it.hidden = false; });
      bf.hidden = true;
      history.replaceState(null, '', location.pathname + '#items');
    });
    bf.querySelector('.bf-ask').addEventListener('click', function () {
      var m = d.querySelector('#podbor textarea[name="msg"]');
      if (m && !m.value) m.value = 'Интересует бренд ' + brand + '. ';
    });
    bf.hidden = false;
  }
})();
