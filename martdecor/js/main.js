(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (s) { return window.typo ? window.typo(s) : s; };
  var rub = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"; };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = t(String(s)); return d.innerHTML; };
  var byId = function (id) { return ITEMS.filter(function (i) { return i.id === id; })[0]; };
  var KEY = "martdecor-podborka";

  /* Подборка живёт только в браузере посетителя */
  var mem = {};
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return mem; } }
  function save(v) { mem = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} badge(); }
  function badge() { var n = Object.keys(load()).length; $$(".js-count").forEach(function (e) { e.textContent = n; e.hidden = !n; }); }
  function toggle(id, qty) { var p = load(); if (p[id]) delete p[id]; else p[id] = qty || 1; save(p); return !!p[id]; }

  /* Шапка и подвал */
  var page = location.pathname.split("/").pop() || "index.html";
  function nav(href, label) { return '<a href="' + href + '"' + (page === href ? ' aria-current="page"' : "") + ">" + label + "</a>"; }
  function chrome() {
    var h = $("#site-header");
    if (h) h.innerHTML =
      '<div class="ribbon">Прототип для обсуждения. Цены и товары настоящие, из каталога на 02.11.2026, заявки никуда не отправляются</div>' +
      '<div class="bar wrap"><a class="brand" href="index.html"><img src="img/logo.png" alt="" width="46" height="46"><span><b>МАРТдекор</b><i>интерьерный салон</i></span></a>' +
      '<nav class="nav" id="nav">' + nav("catalog.html", "Каталог") + '<a href="index.html#podbor">Подбор</a>' + nav("dizayneram.html", "Дизайнерам") + nav("article.html", "Советы") + '<a href="index.html#salon">Салон</a></nav>' +
      '<div class="bar-right"><a class="tel" href="tel:+79094200420">+7 909 420-04-20</a>' +
      '<a class="pick" href="podborka.html"><i class="ti ti-layout-grid-add" aria-hidden="true"></i>Подборка <b class="js-count" hidden>0</b></a>' +
      '<button class="burger" aria-label="Открыть меню" aria-expanded="false"><i class="ti ti-menu-2"></i></button></div></div>';
    var f = $("#site-footer");
    if (f) f.innerHTML = '<div class="wrap foot"><div><img src="img/logo.png" alt="" width="64" height="64"><p>' + esc("Все материалы для стен в одном месте. Ростов-на-Дону, с 2018 года.") + '</p></div>' +
      '<div><h4>Салон</h4><p>' + esc("пр. Михаила Нагибина, 30Л") + '<br>' + esc("пн–пт 10:00–19:00, сб–вс 10:00–17:00") + '</p></div>' +
      '<div><h4>Связь</h4><p><a href="tel:+79094200420">+7 909 420-04-20</a><br><a href="tel:+79094209420">+7 909 420-94-20</a><br><a href="mailto:info@martdecor.ru">info@martdecor.ru</a></p></div>' +
      '<div><h4>Соцсети</h4><p><a href="https://vk.ru/martdecoronline">ВКонтакте</a><br><a href="https://t.me/martdecorrostov">Telegram</a><br><a href="https://www.instagram.com/martdecor.ru">Instagram</a></p></div></div>' +
      '<div class="wrap legal">' + esc("ИП Арийская Людмила Руслановна, ИНН 231129240301. Прототип: выборка 16 позиций из каталога, фото из каталога клиента.") + ' Сделала Ольга.</div>';
    var b = $(".burger");
    if (b) b.addEventListener("click", function () { var o = $("#nav").classList.toggle("open"); b.setAttribute("aria-expanded", o); });
  }

  /* Открыто сейчас: по времени Ростова (UTC+3) */
  function openNow() {
    var n = new Date(Date.now() + (n0() + 180) * 60000), d = n.getDay(), m = n.getHours() * 60 + n.getMinutes();
    var close = d === 0 || d === 6 ? 17 : 19;
    var o = m >= 600 && m < close * 60;
    $$(".js-open").forEach(function (e) {
      e.classList.toggle("is-open", o);
      e.textContent = o ? "Открыто до " + close + ":00" : "Сейчас закрыто, откроемся в 10:00";
    });
  }
  function n0() { return new Date().getTimezoneOffset(); }

  function card(i) {
    var inP = !!load()[i.id];
    return '<article class="card"><a class="arch" href="item.html?id=' + i.id + '"><img src="' + i.img + '" alt="' + esc(i.name) + '" loading="lazy"></a>' +
      '<div class="card-b"><span class="eyebrow">' + esc(i.brand) + '</span><h3><a href="item.html?id=' + i.id + '">' + esc(i.name) + '</a></h3><p>' + esc(i.line) + '</p>' +
      '<div class="card-f"><b class="price">' + rub(i.price) + (i.unit ? '<small> / ' + esc(i.unit) + '</small>' : '') + '</b>' +
      '<button class="add' + (inP ? " on" : "") + '" data-add="' + i.id + '" aria-pressed="' + inP + '">' + (inP ? "В подборке" : "В подборку") + '</button></div></div></article>';
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (!b) return;
    var on = toggle(b.getAttribute("data-add"));
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
    b.textContent = on ? "В подборке" : "В подборку";
  });

  /* Главная */
  function home() {
    var s = $("#sections");
    if (s) s.innerHTML = SECTIONS.map(function (x) {
      return '<a class="sec" href="catalog.html?sec=' + x.id + '"><span class="arch"><img src="' + x.img + '" alt="" loading="lazy"></span><span class="sec-b"><h3>' + esc(x.name) + '</h3><span class="sec-c">' + esc(x.count) + '</span><span>' + esc(x.fact) + '</span><b>' + esc(x.from) + '</b></span></a>';
    }).join("");
    var st = $("#styles");
    if (st) {
      var tabs = $("#style-tabs");
      tabs.innerHTML = STYLES.map(function (x, n) { return '<button role="tab" aria-selected="' + (n === 0) + '" data-style="' + x.id + '">' + esc(x.name) + '</button>'; }).join("");
      var show = function (id) {
        var x = STYLES.filter(function (y) { return y.id === id; })[0];
        var its = ITEMS.filter(function (i) { return i.styles.indexOf(id) >= 0; }).slice(0, 3);
        st.innerHTML = '<div class="style-t"><h3>' + esc(x.name) + '</h3><p class="note">' + esc(x.note) + '</p><p><b>' + esc("Что подойдёт:") + '</b> ' + esc(x.list) + '</p><a class="btn ghost" href="catalog.html?style=' + id + '">' + esc("Все материалы для этого стиля") + '</a></div><div class="grid g3">' + its.map(card).join("") + '</div>';
        $$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-style") === id); });
      };
      tabs.addEventListener("click", function (e) { var b = e.target.closest("[data-style]"); if (b) show(b.getAttribute("data-style")); });
      show("modern");
    }
    var r = $("#reviews");
    if (r) r.innerHTML = REVIEWS.map(rev).join("");
    var rp = $("#reviews-pro");
    if (rp) rp.innerHTML = REVIEWS_PRO.map(rev).join("");
    var a = $("#articles");
    if (a) a.innerHTML = ARTICLES.map(artCard).join("");
    var entry = $("#entry");
    if (entry) entry.addEventListener("click", function (e) {
      var b = e.target.closest("[data-entry]"); if (!b) return;
      $$("[data-entry]", entry).forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      $$("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== b.getAttribute("data-entry"); });
    });
  }
  function rev(x) { return '<figure class="rev"><blockquote>' + esc(x.text) + '</blockquote><figcaption><b>' + esc(x.who) + '</b><span>' + esc(x.role) + '</span></figcaption></figure>'; }
  function artCard(a) { return '<a class="art" href="article.html?id=' + a.id + '"><span class="eyebrow">' + esc(a.date) + '</span><h3>' + esc(a.title) + '</h3><p>' + esc(a.lead) + '</p><b>Читать</b></a>'; }

  /* Каталог */
  function catalog() {
    var grid = $("#cat-grid"); if (!grid) return;
    var q = new URLSearchParams(location.search), st = { sec: q.get("sec") || "", style: q.get("style") || "", budget: "", q: "" };
    $("#f-sec").innerHTML = '<button data-v="">Все разделы</button>' + SECTIONS.map(function (x) { return '<button data-v="' + x.id + '">' + esc(x.name) + '</button>'; }).join("");
    $("#f-style").innerHTML = '<option value="">Любой стиль</option>' + STYLES.map(function (x) { return '<option value="' + x.id + '">' + esc(x.name) + '</option>'; }).join("");
    $("#f-style").value = st.style;
    function draw() {
      var q2 = st.q.toLowerCase().trim();
      var list = ITEMS.filter(function (i) {
        return (!st.sec || i.sec === st.sec) && (!st.style || i.styles.indexOf(st.style) >= 0) &&
          (!st.budget || i.price <= +st.budget) && (!q2 || (i.name + " " + i.brand + " " + i.line).toLowerCase().indexOf(q2) >= 0);
      });
      grid.innerHTML = list.map(card).join("") || '<p class="empty">' + esc("В выборке прототипа такого нет. На готовом сайте поиск пойдёт по всем 84 797 позициям.") + '</p>';
      $("#cat-n").textContent = t(list.length + " из 16 в прототипе");
      $$("#f-sec button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === st.sec); });
    }
    $("#f-sec").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { st.sec = b.getAttribute("data-v"); draw(); } });
    $("#f-style").addEventListener("change", function (e) { st.style = e.target.value; draw(); });
    $("#f-budget").addEventListener("change", function (e) { st.budget = e.target.value; draw(); });
    $("#f-q").addEventListener("input", function (e) { st.q = e.target.value; draw(); });
    draw();
  }

  /* Карточка: расчёт по площади стены */
  function item() {
    var root = $("#item"); if (!root) return;
    var i = byId(new URLSearchParams(location.search).get("id")) || ITEMS[5];
    document.title = i.name + " — МАРТдекор";
    var inP = !!load()[i.id];
    root.innerHTML = '<div class="it-img"><span class="arch big"><img src="' + i.img + '" alt="' + esc(i.name) + '"></span><p class="need"><b>Нужно от вас:</b> ' + esc("фото этого материала на стене в реальном интерьере") + '</p></div>' +
      '<div class="it-b"><a class="back" href="catalog.html?sec=' + i.sec + '">' + esc(SECTIONS.filter(function (s) { return s.id === i.sec; })[0].name) + '</a><h1>' + esc(i.name) + '</h1><p class="lead">' + esc(i.line) + '</p>' +
      '<p class="price big-p">' + rub(i.price) + (i.unit ? '<small> / ' + esc(i.unit) + '</small>' : '') + '</p>' +
      (i.need ? '<p class="need"><b>Нужно от вас:</b> ' + esc(i.need) + '</p>' : '') +
      '<p class="stock"><i class="ti ti-clock" aria-hidden="true"></i>' + esc("Наличие и срок поставки подтвердит менеджер перед счётом") + '</p>' +
      (i.cover ? '<div class="calc"><label for="area">' + esc("Сколько нужно на вашу стену") + '</label><div class="calc-r"><input id="area" type="number" min="1" value="12" inputmode="decimal"><span>м²</span><output id="calc-o"></output></div><small>' + esc("Предварительно, без запаса на подгонку рисунка. Точное количество посчитает менеджер.") + '</small></div>' : '') +
      '<div class="it-act"><button class="btn add-big' + (inP ? " on" : "") + '" data-add="' + i.id + '" aria-pressed="' + inP + '">' + (inP ? "В подборке" : "В подборку") + '</button><a class="btn ghost" href="index.html#salon">' + esc("Посмотреть образец в салоне") + '</a></div>' +
      '<dl class="specs">' + i.specs.map(function (s) { return '<dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join("") + '</dl>' +
      '<p class="src">Источник: <a href="' + i.src + '">' + esc("карточка в каталоге martdecor.online") + '</a></p></div>';
    var ar = $("#area");
    if (ar) {
      var calc = function () {
        var n = Math.max(1, Math.ceil((+ar.value || 0) / i.cover));
        $("#calc-o").textContent = t("Нужно " + n + " (" + i.unit + "), ") + rub(n * i.price);
      };
      ar.addEventListener("input", calc); calc();
    }
    var more = ITEMS.filter(function (x) { return x.id !== i.id && x.styles.some(function (s) { return i.styles.indexOf(s) >= 0; }) && x.sec !== i.sec; }).slice(0, 3);
    $("#item-more").innerHTML = more.map(card).join("");
  }

  /* Подборка */
  function podborka() {
    var root = $("#pod"); if (!root) return;
    function draw() {
      var p = load(), ids = Object.keys(p);
      if (!ids.length) { root.innerHTML = '<div class="empty-box"><p>' + esc("Пока пусто. Добавьте материалы из каталога или просто пришлите проект: менеджер соберёт подборку сам.") + '</p><a class="btn" href="catalog.html">Открыть каталог</a></div>'; $("#pod-sum").textContent = ""; return; }
      var sum = 0, unknown = 0;
      root.innerHTML = ids.map(function (id) {
        var i = byId(id); if (!i) return "";
        sum += i.price * p[id]; if (!i.unit) unknown++;
        return '<div class="row"><img src="' + i.img + '" alt=""><div><a href="item.html?id=' + id + '">' + esc(i.name) + '</a><small>' + rub(i.price) + (i.unit ? ' / ' + esc(i.unit) : '') + '</small></div>' +
          '<label class="qty"><span class="sr">Количество</span><input type="number" min="1" value="' + p[id] + '" data-q="' + id + '"></label>' +
          '<button class="x" data-x="' + id + '" aria-label="Убрать из подборки"><i class="ti ti-x"></i></button></div>';
      }).join("");
      $("#pod-sum").innerHTML = 'Предварительно: <b>' + rub(sum) + '</b><small>' + esc("Счёт выставит менеджер, когда проверит наличие и количество.") + '</small>';
    }
    root.addEventListener("click", function (e) { var b = e.target.closest("[data-x]"); if (b) { var p = load(); delete p[b.getAttribute("data-x")]; save(p); draw(); } });
    root.addEventListener("change", function (e) { var q = e.target.getAttribute("data-q"); if (q) { var p = load(); p[q] = Math.max(1, +e.target.value || 1); save(p); draw(); } });
    draw();
  }

  /* Статьи */
  function article() {
    var root = $("#article"); if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var list = $("#art-list");
    list.innerHTML = ARTICLES.map(artCard).join("");
    var a = ARTICLES.filter(function (x) { return x.id === id; })[0] || ARTICLES[0];
    root.innerHTML = '<span class="eyebrow">' + esc(a.date) + '</span><h1>' + esc(a.title) + '</h1><p class="lead">' + esc(a.lead) + '</p>' +
      a.body.map(function (b) { return '<h2>' + esc(b[0]) + '</h2><p>' + esc(b[1]) + '</p>'; }).join("") +
      '<p class="src">Из <a href="' + a.src + '">' + esc("поста в Telegram-канале салона") + '</a></p>';
  }

  /* Формы прототипа */
  function forms() {
    $$("form[data-demo]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = f.querySelector(".ok"); ok.hidden = false; ok.focus();
      });
    });
    $$("input[type=file]").forEach(function (i) {
      i.addEventListener("change", function () { var o = i.parentNode.querySelector(".file-n"); if (o) o.textContent = i.files.length ? i.files[0].name : ""; });
    });
    var d = $$("details.faq");
    d.forEach(function (x) { x.addEventListener("toggle", function () { if (x.open) d.forEach(function (y) { if (y !== x) y.open = false; }); }); });
  }

  chrome(); badge(); openNow(); home(); catalog(); item(); podborka(); article(); forms();
})();
