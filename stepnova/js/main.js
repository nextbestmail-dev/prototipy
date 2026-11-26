function $(s) { return document.querySelector(s); }

// Отзывы — дословно со скриншотов в посте ВК 577 (19.09.2025)
var REVIEWS = [
  { img: "p577_1", t: "Настя — все очевидно) помогают твои тренировки — результат, который получаю, общение с тобой — столько энергии и сил после наших встреч — так что вот так)))", w: "Участница тренировок" },
  { img: "p577_1", t: "Я совсем не спортивный человек — благодаря твоим тренировкам — я полюбила спорт, жду очередную тренировку 😍", w: "Участница тренировок" },
  { img: "p577_2", t: "Начали заниматься с Анастасией по индивидуальной программе примерно 1,5 месяца назад. Была установка на похудение — минимум 5 кг. Сейчас уже минус 4 кг. Очень нравится, что разнообразная программа, всегда заряд бодрости и хорошего настроения.", w: "Индивидуальная программа" }
];

var QUIZ = [
  { q: "Где тебе удобнее заниматься?", o: [["ti-building", "В зале, в Саратове", "club"], ["ti-home", "Дома, в своё время", "online"], ["ti-help", "Пока не знаю", "any"]] },
  { q: "Что для тебя сейчас главное?", o: [["ti-scale", "Похудеть и подтянуть фигуру", "slim"], ["ti-stretching", "Спина, гибкость, снять зажимы", "back"], ["ti-users", "Энергия и компания единомышленниц", "club"]] },
  { q: "Сколько времени готова уделять?", o: [["ti-clock", "20 минут 3–4 раза в неделю", "online"], ["ti-calendar", "Три вечера в неделю в зале", "club"], ["ti-sun", "Утро на свежем воздухе", "club"]] }
];

// Отзывы
$("#revList").innerHTML = REVIEWS.map(function (r) {
  return '<div class="rev glass reveal"><span class="hand">“</span><p>' + typo(r.t) + '</p><div class="who"><img src="img/' + r.img + '.jpg" alt=""><span>' + r.w + '<br>из отзывов в соцсетях</span></div></div>';
}).join("");

// Квиз
var step = 0, score = { club: 0, online: 0, back: 0, slim: 0 };
function renderQuiz() {
  document.querySelectorAll(".steps span").forEach(function (s, i) { s.classList.toggle("on", i <= step); });
  if (step >= QUIZ.length) {
    var res;
    if (score.back > 0) res = ["«Здоровая спина / мягкая сила»", "Соматический фитнес — в зале или в записи дома. Мягко, без перегрузок, с дыхательной практикой.", "Здоровая спина"];
    else if (score.club > score.online) res = ["Тренировки в клубе", "Группа в спорткомплексе F1 по понедельникам, средам и пятницам в 20:00. Энергия, компания и девичники.", "Тренировки в клубе"];
    else res = ["Закрытый онлайн-проект", "30 дней, тренировки по 20 минут в записи и меню. Занимаешься дома, когда удобно.", "Закрытый онлайн-проект"];
    $("#qBox").innerHTML = '<div class="result"><div class="eyebrow">Тебе подойдёт</div><h3 style="margin:6px 0 8px">' + typo(res[0]) + '</h3><p>' + typo(res[1]) + '</p></div><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a href="#contact" class="btn btn-main" data-fmt="' + res[2] + '">Записаться</a><button class="btn btn-ghost" style="border-color:var(--caramel)" id="qAgain">Пройти заново</button></div>';
    $("#qAgain").onclick = function () { step = 0; score = { club: 0, online: 0, back: 0, slim: 0 }; renderQuiz(); };
    return;
  }
  var s = QUIZ[step];
  $("#qBox").innerHTML = '<p style="font-weight:700;margin-bottom:12px">' + typo(s.q) + '</p><div class="opts">' + s.o.map(function (o) {
    return '<button class="opt" data-v="' + o[2] + '"><i class="ti ' + o[0] + '"></i>' + typo(o[1]) + '</button>';
  }).join("") + '</div>';
}
$("#qBox").addEventListener("click", function (e) {
  var b = e.target.closest(".opt"); if (!b) return;
  if (score[b.dataset.v] !== undefined) score[b.dataset.v]++;
  step++; renderQuiz();
});
renderQuiz();

// Кнопки «Записаться» подставляют формат в форму
document.addEventListener("click", function (e) {
  var a = e.target.closest("[data-fmt]"); if (a) $("#fmtSel").value = a.dataset.fmt;
});
$("#form").addEventListener("submit", function (e) { e.preventDefault(); $("#ok").style.display = "block"; });

// Лайтбокс для галереи
$("#gallery").addEventListener("click", function (e) {
  var img = e.target.closest("figure img"); if (!img) return;
  $("#lb img").src = img.src; $("#lb").classList.add("on");
});
$("#lb").addEventListener("click", function () { this.classList.remove("on"); });

// Появление при прокрутке
var io = new IntersectionObserver(function (es) {
  es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

// Набор в онлайн-проект: открыт или закрыт.
// Настя меняет две ячейки в своей Google Таблице: B1 — «открыт» или «закрыт», B2 — до какого числа (например, «5 декабря»).
// Сюда вставить ссылку на таблицу. Пока пусто — показывается «набор закрыт» и лист ожидания.
var NABOR_SHEET = "";
function setNabor(open, until) {
  var box = $("#nabor"), btn = $("#naborBtn"), ic = box.querySelector(".nabor-st i");
  box.dataset.state = open ? "open" : "closed";
  ic.className = "ti " + (open ? "ti-flame" : "ti-hourglass");
  $("#naborTxt").innerHTML = open ? (until ? "Идёт набор до&nbsp;" + until : "Идёт набор") : "Набор закрыт&nbsp;· скоро новый поток";
  btn.innerHTML = open ? "Войти в&nbsp;проект" : "Записаться в&nbsp;лист ожидания";
  btn.dataset.fmt = open ? "Закрытый онлайн-проект" : "Лист ожидания онлайн-проекта";
}
(function () {
  var test = new URLSearchParams(location.search).get("nabor"); // для проверки: ?nabor=open
  if (test) { setNabor(test === "open", "5 декабря"); return; }
  var m = NABOR_SHEET.match(/\/d\/([\w-]+)/); if (!m) return;
  fetch("https://docs.google.com/spreadsheets/d/" + m[1] + "/gviz/tq?tqx=out:csv&range=A1:B2", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw 0; return r.text(); })
    .then(function (t) {
      var rows = t.trim().split(/\r?\n/).map(function (l) { return l.split('","').map(function (x) { return x.replace(/^"|"$/g, "").trim(); }); });
      var st = ((rows[0] || [])[1] || "").toLowerCase(), until = (rows[1] || [])[1] || "";
      setNabor(st.indexOf("откр") === 0, until);
    })
    .catch(function () {}); // таблица не открылась — остаётся «набор закрыт»
})();
