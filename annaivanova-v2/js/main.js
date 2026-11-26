/* ANNAIVANOVA — общая логика прототипа: шапка, футер, корзина, карточки, запись на примерку */

const RUB = n => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
const byId = id => PRODUCTS.find(p => p.id === id) || (typeof TICKETS !== 'undefined' && TICKETS.find(p => p.id === id));
const qs = new URLSearchParams(location.search);
const nb = s => s.replace(/(^|[\s ])([а-яёА-ЯЁ]{1,2})\s/g, '$1$2 ').replace(/(^|[\s ])([а-яёА-ЯЁ]{1,2})\s/g, '$1$2 ');
const plural = (n, a, b, c) => { const m = n % 100, k = n % 10; return n + ' ' + (m > 10 && m < 20 ? c : k === 1 ? a : k >= 2 && k <= 4 ? b : c); };

/* ---------- плейсхолдер вместо фото ---------- */
function ph(p, label, cls = '') {
  const t = TONES[(p && p.tone) || 'choc'] || TONES.choc;
  return `<div class="ph ${cls}${p && p.tone === 'ceiling' ? ' ceiling' : ''}" style="--c1:${t[0]};--c2:${t[1]}" data-label="${label || 'фото'}"><span class="mono">ANNA\\IVANOVA</span></div>`;
}
function phTone(tone, label, cls = '') { return ph({ tone }, label, cls); }

/* ---------- корзина (хранится в браузере) ---------- */
const CART_KEY = 'ai_cart_v1';
function cartRead() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
function cartWrite(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} paintCount(); }
function cartAdd(id, size, qty = 1) {
  const c = cartRead();
  const f = c.find(i => i.id === id && i.size === size);
  if (f) f.qty += qty; else c.push({ id, size, qty });
  cartWrite(c);
  toast('Добавлено в корзину');
}
const FAV_KEY = 'ai_fav_v1';
function favRead() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
function favHas(id) { return favRead().includes(id); }
function favToggle(id, btn) {
  let f = favRead(); f = f.includes(id) ? f.filter(x => x !== id) : f.concat(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify(f)); } catch (e) {}
  if (btn) { btn.classList.toggle('on', f.includes(id)); btn.setAttribute('aria-pressed', f.includes(id)); }
  document.querySelectorAll('.fav-count').forEach(el => el.textContent = f.length || '');
  if (typeof toast === 'function') toast(f.includes(id) ? 'Добавлено в избранное' : 'Убрано из избранного');
}
function cartCount() { return cartRead().reduce((s, i) => s + i.qty, 0); }
function cartSum() { return cartRead().reduce((s, i) => s + (byId(i.id) ? byId(i.id).price * i.qty : 0), 0); }
function paintCount() { document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount()); document.querySelectorAll('.fav-count').forEach(el => el.textContent = favRead().length || ''); }

/* ---------- уведомление ---------- */
let toastTimer;
function toast(text) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = text;
  requestAnimationFrame(() => el.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ---------- шапка и футер ---------- */
function paintChrome(active) {
  const a = id => active === id ? 'class="active"' : '';
  const header = `
  <div class="demo-bar"><b>Прототип сайта для&nbsp;ANNAIVANOVA · версия&nbsp;2.</b> Тексты, цены и&nbsp;факты&nbsp;— с&nbsp;сайта, wfolio и&nbsp;соцсетей бренда; вместо фотографий&nbsp;— заглушки, формы ничего не&nbsp;отправляют.</div>
  <div class="topline"><div class="wrap">
    <a href="info.html">Покупателям: доставка по&nbsp;России, размеры, пошив&nbsp;→</a>
    <a href="house.html" class="hide-m">Модный дом: Саратов, ул.&nbsp;Советская,&nbsp;3/5 · пн–пт 9:00–18:00</a>
    <a href="tel:+79271174763" class="hide-m">+7&nbsp;927&nbsp;117-47-63</a>
  </div></div>
  <header class="site"><div class="head">
    <nav class="main" id="nav">
      <a href="events.html" ${a('events')}>Афиша</a>
      <a href="catalog.html" ${a('catalog')}>Магазин</a>
      <a href="designer.html" ${a('designer')}>Анна Иванова</a>
      <a href="specprojects.html" ${a('projects')}>Спецпроекты</a>
      <a href="gifts.html" ${a('gifts')}>Gift Edit</a>
    </nav>
    <button class="burger" onclick="document.getElementById('nav').classList.toggle('open')" aria-label="Меню">Меню</button>
    <a href="index.html" class="logo" aria-label="ANNAIVANOVA, на главную">ANNA<span>\\</span>IVANOVA</a>
    <div class="head-act">
      <a href="#" class="hide-m" onclick="openFitting();return false">Примерка</a>
      <a href="fav.html" class="fav-link" aria-label="Избранное">&#9825; <span class="fav-count"></span></a>
      <a href="cart.html">Корзина <span class="cart-count">0</span></a>
    </div>
  </div></header>`;

  const footer = `
  <footer class="site"><div class="wrap">
    <div class="f-grid">
      <div>
        <a href="index.html" class="logo">ANNA<span>\\</span>IVANOVA</a>
        <p style="font-size:14.5px;max-width:36ch;margin-top:18px">Модный дом дизайнера Анны Ивановой. Авторские принты, ограниченные тиражи, мастерская в&nbsp;здании 1911 года. Саратов, с&nbsp;1998 года.</p>
      </div>
      <div><h4>Магазин</h4><ul>
        <li><a href="catalog.html">Осень-зима 2027 «Метель»</a></li>
        <li><a href="story.html?id=metel">История коллекции</a></li>
        <li><a href="catalog.html?coll=outlet">Outlet</a></li>
        <li><a href="gifts.html">Gift Edit: сертификаты и&nbsp;подарки</a></li>
      </ul></div>
      <div><h4>Модный дом</h4><ul>
        <li><a href="designer.html">Анна Иванова</a></li>
        <li><a href="house.html">Модный дом</a></li>
        <li><a href="designer.html#archive">Коллекции разных лет</a></li>
        <li><a href="specprojects.html">Спецпроекты</a></li>
        <li><a href="events.html">Афиша</a></li>
      </ul></div>
      <div><h4>Покупателям</h4><ul>
        <li><a href="info.html#delivery">Доставка и&nbsp;оплата</a></li>
        <li><a href="info.html#sizes">Размеры</a></li>
        <li><a href="info.html#tailoring">Индивидуальный пошив</a></li>
        <li><a href="info.html#club">Клубная система</a></li>
        <li><a href="tel:+79271174763">+7&nbsp;927&nbsp;117-47-63</a></li>
        <li><a href="mailto:post@annaivanova.com">post@annaivanova.com</a></li>
      </ul></div>
    </div>
    <div class="f-bottom">
      <span>© 2026 ANNAIVANOVA® — зарегистрированный товарный знак · <a href="https://t.me/annaivanovasaratov">Telegram</a> · <a href="https://www.instagram.com/annaivanova_fashion/">Instagram</a> · <a href="https://www.instagram.com/annaivanova_designer/">Блог Анны</a> · <a href="https://vk.com/annaivanova_shop">ВКонтакте</a></span>
      <span>Прототип собрала: Ольга</span>
    </div>
  </div></footer>

  <div class="modal" id="fitting" onclick="if(event.target===this)closeFitting()">
    <div class="modal-box">
      <button class="modal-close" onclick="closeFitting()" aria-label="Закрыть">×</button>
      <div class="eyebrow">Модный дом ANNAIVANOVA</div>
      <h3>Записаться на&nbsp;примерку</h3>
      <p class="muted" id="fit-what">Подберём образы к&nbsp;вашему визиту и&nbsp;подготовим размеры. Не&nbsp;в&nbsp;Саратове&nbsp;— ассистент проведёт подбор онлайн.</p>
      <form class="form-grid" onsubmit="event.preventDefault();closeFitting();toast('Заявка принята (демо): ассистент свяжется с вами')">
        <label>Имя<input required autocomplete="name"></label>
        <label>Телефон<input required inputmode="tel" autocomplete="tel"></label>
        <label>Где удобнее ответить<select><option>WhatsApp</option><option>Telegram</option><option>MAX</option></select></label>
        <label>Как удобнее
          <select><option>Примерка в Модном доме, Саратов</option><option>Онлайн-подбор с ассистентом</option><option>Индивидуальный пошив по меркам</option></select>
        </label>
        <button class="btn wide" type="submit">Записаться</button>
        <span class="demo-note">Демо: форма ничего не отправляет. На сайте заявка придёт ассистенту в&nbsp;мессенджер.</span>
      </form>
    </div>
  </div>`;

  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
  paintCount();
}
function openFitting(what) {
  const el = document.getElementById('fitting');
  if (what) document.getElementById('fit-what').innerHTML = `Модель: <b>${what}</b>. Подготовим её к&nbsp;вашему визиту в&nbsp;нужном размере, а&nbsp;если вы не&nbsp;в&nbsp;Саратове&nbsp;— ассистент подскажет с&nbsp;размером онлайн.`;
  el.classList.add('on');
}
function closeFitting() { document.getElementById('fitting').classList.remove('on'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal.on').forEach(m => m.classList.remove('on')); });

/* ---------- карточка в сетке ---------- */
function priceHTML(p) {
  return p.old ? `<div class="price"><span class="now">${RUB(p.price)}</span><s>${RUB(p.old)}</s></div>` : `<div class="price">${RUB(p.price)}</div>`;
}
function cardHTML(p) {
  const tags = [];
  if (p.status === 'pre') tags.push('<span class="tag pre">Предзаказ</span>');
  if (p.old) tags.push(`<span class="tag sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>`);
  if (p.isNew) tags.push('<span class="tag">Новинка</span>');
  const ed = p.stockSizes ? `<div class="edition">В наличии: размер ${p.stockSizes.join(', ')} · ограниченный тираж</div>` : '';
  return `<article class="card">
    <a href="product.html?id=${p.id}">
      <div class="card-media"><div class="tags">${tags.join('')}</div>${ph(p, COLLECTIONS[p.coll].short)}</div>
      <h3>${nb(p.name)}</h3>
    </a>
    <button class="fav-btn${favHas(p.id) ? ' on' : ''}" aria-label="В избранное" aria-pressed="${favHas(p.id)}" onclick="favToggle('${p.id}', this)">&#9825;</button>
    ${priceHTML(p)}
    ${ed}
  </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
  paintChrome(document.body.dataset.page || '');
  document.querySelectorAll('[data-ph]').forEach(el => { const [tone, label, cls] = el.dataset.ph.split('|'); el.outerHTML = phTone(tone, label, cls || ''); });
});
