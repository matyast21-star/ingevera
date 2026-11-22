(function(){
  'use strict';
  var WA = '56987532943';

  // Menu
  var btn = document.querySelector('.nav__menu'), menu = document.getElementById('menu');
  function setMenu(open){
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.sr').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    menu.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    ['main', '.foot', '.bar'].forEach(function(sel){ var el = document.querySelector(sel); if (el) el.inert = open; });
  }
  if (btn && menu){
    btn.addEventListener('click', function(){ setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !menu.hidden){ setMenu(false); btn.focus(); } });
    window.matchMedia('(min-width:1061px)').addEventListener('change', function(m){ if (m.matches) setMenu(false); });
  }

  // Open / closed, in Chile's time zone
  function chileNow(){
    try {
      var parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Santiago', weekday:'short', hour:'numeric', minute:'numeric', hourCycle:'h23'}).formatToParts(new Date());
      var o = {}; parts.forEach(function(p){ o[p.type] = p.value; });
      var days = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
      return {day: days[o.weekday], min: (+o.hour) * 60 + (+o.minute)};
    } catch (e) { return null; }
  }
  var now = chileNow();
  if (now){
    var open = now.day >= 1 && now.day <= 6 && now.min >= 540 && now.min < 1080;
    var label = open ? 'Abierto ahora' : 'Cerrado ahora';
    var s = document.querySelector('[data-status]');
    if (s){ s.textContent = label; s.className = 'status ' + (open ? 'is-open' : 'is-closed'); s.hidden = false; }
    var n = document.querySelector('[data-now]');
    if (n){
      var nb = '\u00a0';
      var next = open ? ' · cerramos a' + nb + 'las' + nb + '18:00' : (now.day >= 1 && now.day <= 6 && now.min < 540 ? ' · abrimos hoy a' + nb + 'las' + nb + '9:00' : ' · abrimos ' + (now.day === 6 || now.day === 0 ? 'el' + nb + 'lunes' : 'mañana') + ' a' + nb + 'las' + nb + '9:00');
      n.textContent = label + next; n.className = 'hours__now' + (open ? ' is-open' : ''); n.hidden = false;
    }
    var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add('is-today');
  }

  // Form -> WhatsApp
  var form = document.getElementById('form');
  if (form){
    var name = form.elements.name, err = document.getElementById('e-name');
    name.addEventListener('input', function(){ if (name.value.trim()){ err.hidden = true; name.removeAttribute('aria-invalid'); name.removeAttribute('aria-describedby'); } });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!name.value.trim()){
        err.hidden = false; name.setAttribute('aria-invalid','true'); name.setAttribute('aria-describedby','e-name'); name.focus(); return;
      }
      var f = form.elements;
      var lines = ['Hola INGEVERA, soy ' + name.value.trim() + '.', 'Necesito: ' + f.svc.value + '.'];
      if (f.where.value.trim()) lines.push('Sector: ' + f.where.value.trim() + '.');
      if (f.msg.value.trim()) lines.push(f.msg.value.trim());
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // Mobile contact bar appears after the hero
  var bar = document.querySelector('.bar'), hero = document.querySelector('.hero');
  if (bar && hero && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){ bar.classList.toggle('is-on', !es[0].isIntersecting); }, {rootMargin:'-40% 0px 0px 0px'}).observe(hero);
  }

  var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  if ('serviceWorker' in navigator && location.protocol === 'https:'){
    window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
  }
})();
