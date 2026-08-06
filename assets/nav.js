/* nav.js — 모바일 햄버거 메뉴 + 하위메뉴 아코디언 (2026-08-05 개편)
 *
 * 왜 아코디언인가: 예전엔 모바일에서 하위메뉴 24개가 전부 펼쳐진 채라 메뉴 내용이 1212px 이 됐고,
 * max-height:76vh 에 잘려 375x812 화면의 76% 를 덮었다. 오시는 길 지도가 통째로 가려졌다.
 * 이제 상위 7개만 보이고(약 350px), 캐럿을 눌러야 하위가 펼쳐진다.
 *
 * 드로어로 전환되는 화면 폭이 언어마다 다르다(라벨 길이 차이).
 *   한국어 860px / 베트남어·영어 1100px  ← site.css 의 미디어쿼리와 반드시 같아야 한다.
 * CSS 를 또 복사하는 대신 여기서 html.nav-drawer 를 붙여 site.css 14절이 받게 한다.
 */
(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  if (!header) return;

  var lang = root.getAttribute('lang') || 'ko';
  var mq = window.matchMedia(
    (lang === 'vi' || lang === 'en') ? '(max-width:1100px)' : '(max-width:860px)');

  var LABEL = { ko: '하위 메뉴', vi: 'menu phụ', en: 'submenu' };
  var sublabel = LABEL[lang] || LABEL.ko;

  /* ── 하위메뉴 펼치기 버튼 삽입 ──────────────────────────────────────
     상위 링크는 그대로 해당 페이지로 이동해야 하므로 링크 자체를 토글로 쓰지 않는다.
     버튼은 데스크톱에선 CSS 로 숨는다(.subtoggle{display:none}). */
  var items = [].slice.call(document.querySelectorAll('.nav-item'));

  function collapseAll() {
    items.forEach(function (o) {
      o.classList.remove('open');
      var b = o.querySelector('.subtoggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (item) {
    var sub = item.querySelector('.submenu');
    var link = item.querySelector('a');
    if (!sub || !link || item.querySelector('.subtoggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'subtoggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', (link.textContent || '').trim() + ' ' + sublabel);
    var caret = document.createElement('i');       // innerHTML 안 씀 — 노드로 직접 만든다
    caret.className = 'ti ti-chevron-down';
    caret.setAttribute('aria-hidden', 'true');
    btn.appendChild(caret);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains('open');
      collapseAll();   // 한 번에 하나만 — 그래야 드로어가 다시 길어지지 않는다
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    item.appendChild(btn);
  });

  /* ── 배경(스크림) ───────────────────────────────────────────────── */
  var scrim = document.querySelector('.nav-scrim');
  if (!scrim) {
    scrim = document.createElement('button');
    scrim.type = 'button';
    scrim.className = 'nav-scrim';
    scrim.setAttribute('aria-label', '메뉴 닫기');
    scrim.tabIndex = -1;
    document.body.appendChild(scrim);
  }

  var toggles = [].slice.call(document.querySelectorAll('.nav-toggle'));

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    root.classList.toggle('nav-open', open);
    toggles.forEach(function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      var ic = b.querySelector('i');
      if (ic) ic.className = open ? 'ti ti-x' : 'ti ti-menu-2';
    });
    if (!open) collapseAll();
  }
  function close() { setOpen(false); }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav-open'));
    });
  });

  scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) close();
  });
  // 메뉴에서 링크를 고르면 닫는다(같은 페이지 앵커면 이동이 안 보이므로 특히 필요)
  [].slice.call(document.querySelectorAll('.nav a')).forEach(function (a) {
    a.addEventListener('click', close);
  });

  /* ── 화면 폭에 따라 드로어 모드 on/off ───────────────────────────── */
  function sync() {
    root.classList.toggle('nav-drawer', mq.matches);
    if (!mq.matches) close();   // 데스크톱으로 넓히면 열린 상태가 남지 않게
  }
  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync);
  else if (mq.addListener) mq.addListener(sync);   // 구형 사파리
  // matchMedia 이벤트가 안 오는 환경이 있어(개발자도구 뷰포트 강제 변경 등) resize 로도 받는다.
  // 이게 없으면 드로어 상태가 남아 데스크톱에서 페이지 스크롤이 잠긴다.
  window.addEventListener('resize', sync);
})();
