// Упражнения — названия с обложек видео в ВК (посты 137–172, сентябрь–ноябрь 2026)
var TRACKS = [
// v — видео в группе ВК, d — текст из поста
  { img: "p137_1", t: "Красивые ягодицы", s: "Упражнение из видео, ВК 02.09.2026", m: "ягодицы", v: "456239255", d: "Одно из упражнений онлайн-проекта: занимайся по 20 минут в день в любое удобное время, не выходя из дома." },
  { img: "p139_1", t: "Красивый рельеф спины", s: "Упражнение из видео, ВК 02.09.2026", m: "спина", v: "456239257", d: "Из курса на 30 дней: снижение отёков, повышение выносливости и гармоничная работа со всеми группами мышц." },
  { img: "p140_1", t: "Базовое упражнение для стройных ног", s: "Упражнение из видео, ВК 02.09.2026", m: "ноги", v: "456239258", d: "Базовое упражнение для стройных ног — его можно делать дома, без зала и тренажёров." },
  { img: "p141_1", t: "Красивая походка и изящная фигура", s: "Упражнение из видео, ВК 05.09.2026", m: "всё тело", v: "456239259", d: "Тренировки не выходя из дома: каждую неделю новая нагрузка, 3–4 раза в неделю по 20 минут." },
  { img: "p169_1", t: "Красивые бёдра и повышение выносливости", s: "Упражнение из видео, ВК 12.10.2026", m: "бёдра", v: "456239305", d: "Занимайся со мной онлайн дома или в Саратове в спорткомплексе — выбирай свой формат." }
];

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

function $(s) { return document.querySelector(s); }

// Плейлист
var cur = 0;
function renderTracks() {
  $("#tracks").innerHTML = TRACKS.map(function (x, i) {
    return '<div class="track' + (i === cur ? " playing" : "") + '" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><img src="img/' + x.img + '.jpg" alt=""><div><b>' + typo(x.t) + '</b><small>' + typo(x.s) + '</small></div><span class="meta">' + x.m + '</span><i class="ti ti-heart like"></i></div>';
  }).join("");
}
function setTrack(i) {
  cur = (i + TRACKS.length) % TRACKS.length;
  $("#nowImg").src = "img/" + TRACKS[cur].img + ".jpg";
  $("#nowTitle").textContent = typo(TRACKS[cur].t);
  $("#bar").style.width = ((cur + 1) / TRACKS.length * 100) + "%";
  renderTracks();
}
// Окно с упражнением: обложка, текст из поста и ссылка на видео в ВК
function openEx(i) {
  var x = TRACKS[i];
  $("#exImg").src = "img/" + x.img + ".jpg";
  $("#exTag").textContent = x.m;
  $("#exTitle").textContent = typo(x.t);
  $("#exText").textContent = typo(x.d);
  $("#exVid").href = "https://vk.com/video-228220720_" + x.v;
  $("#ex").classList.add("on");
  $("#bar").style.width = ((i + 1) / TRACKS.length * 100) + "%";
}
function closeEx() { $("#ex").classList.remove("on"); }
$("#ex").addEventListener("click", function (e) {
  if (e.target === this || e.target.closest(".ex-x") || e.target.closest("[data-close]")) closeEx();
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeEx(); });
renderTracks();
$("#bar").style.width = (100 / TRACKS.length) + "%";
$("#tracks").addEventListener("click", function (e) {
  if (e.target.classList.contains("like")) { e.target.classList.toggle("on"); e.target.classList.toggle("ti-heart-filled"); return; }
  var t = e.target.closest(".track"); if (!t) return;
  setTrack(+t.dataset.i); openEx(cur);
});
document.querySelectorAll(".player [data-p]").forEach(function (b) {
  b.addEventListener("click", function () {
    var p = b.dataset.p;
    if (p === "play") openEx(cur); else setTrack(cur + (p === "next" ? 1 : -1));
  });
});

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

// Подсветка дока
var dockLinks = document.querySelectorAll(".dock a");
window.addEventListener("scroll", function () {
  var y = window.scrollY + 200, on = dockLinks[0];
  dockLinks.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t && t.offsetTop <= y) on = a; });
  dockLinks.forEach(function (a) { a.classList.toggle("on", a === on); });
});
