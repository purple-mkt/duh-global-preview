/* hero.js — 홈 히어로 사진 슬라이더(캐러셀)
   자동 슬라이드 + 이전/다음 화살표 + 점(dot). 마우스오버/포커스 시 정지,
   prefers-reduced-motion이면 자동재생 없이 수동만. */
(function () {
  var root = document.querySelector('.hero-carousel');
  if (!root) return;
  var track = root.querySelector('.hc-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.hc-slide'));
  var dotsWrap = root.querySelector('.hc-dots');
  if (!track || slides.length < 2) return;

  var i = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var interval = parseInt(root.getAttribute('data-autoplay'), 10) || 5000;

  slides.forEach(function (s, idx) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', (idx + 1) + '번 사진 보기');
    b.addEventListener('click', function () { go(idx); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    dots.forEach(function (d, idx) { d.setAttribute('aria-current', idx === i ? 'true' : 'false'); });
  }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }
  function start() { if (reduce) return; stop(); timer = setInterval(next, interval); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  var nextBtn = root.querySelector('.hc-next');
  var prevBtn = root.querySelector('.hc-prev');
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  go(0);
  start();
})();
