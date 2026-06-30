/* ============================================================
   deck.js — 스크롤 스냅 슬라이드 공용 로직
   .deck 안의 .slide 들을 한 화면씩 스냅 + 점 네비 자동 생성 +
   진입 모션(reveal) + 미리보기 설정(스냅 강도/모션) 토글
   ============================================================ */
(function () {
  var deck = document.querySelector('.deck');
  if (!deck) return;
  if (!deck.dataset.snap) deck.dataset.snap = 'mandatory';
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));

  /* 우측 점 네비게이션 자동 생성 */
  var dotsNav = document.createElement('nav');
  dotsNav.className = 'dots';
  dotsNav.setAttribute('aria-label', '섹션 이동');
  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    var label = s.getAttribute('data-dot') || s.getAttribute('aria-label') || ('섹션 ' + (i + 1));
    b.setAttribute('aria-label', label + '로 이동');
    if (s.classList.contains('s-navy')) b.classList.add('on-dark');
    b.addEventListener('click', function () { s.scrollIntoView({ behavior: 'smooth' }); });
    dotsNav.appendChild(b);
  });
  document.body.appendChild(dotsNav);
  var dots = Array.prototype.slice.call(dotsNav.querySelectorAll('button'));

  /* 미리보기 설정(개발용) 자동 생성 */
  var dev = document.createElement('div');
  dev.className = 'devbar';
  dev.setAttribute('aria-label', '미리보기 설정');
  dev.innerHTML =
    '<div class="row"><span class="lbl">스냅</span>' +
    '<button data-snap="mandatory" class="sel">강하게</button>' +
    '<button data-snap="proximity">부드럽게</button>' +
    '<button data-snap="none">끄기</button></div>' +
    '<div class="row"><span class="lbl">모션</span>' +
    '<button data-motion="on" class="sel">켜기</button>' +
    '<button data-motion="off">끄기</button></div>';
  document.body.appendChild(dev);
  dev.querySelectorAll('[data-snap]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      deck.dataset.snap = btn.dataset.snap;
      dev.querySelectorAll('[data-snap]').forEach(function (x) { x.classList.toggle('sel', x === btn); });
    });
  });
  dev.querySelectorAll('[data-motion]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      deck.classList.toggle('nomotion', btn.dataset.motion === 'off');
      dev.querySelectorAll('[data-motion]').forEach(function (x) { x.classList.toggle('sel', x === btn); });
    });
  });

  /* 현재 슬라이드 → 점 활성 + 진입 모션(재진입 시 재생) */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var i = slides.indexOf(e.target);
      if (e.isIntersecting) {
        e.target.classList.add('in');
        dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
      } else {
        e.target.classList.remove('in');
      }
    });
  }, { root: deck, threshold: 0.55 });
  slides.forEach(function (s) { io.observe(s); });

  if (slides[0]) { slides[0].classList.add('in'); if (dots[0]) dots[0].classList.add('on'); }
})();
