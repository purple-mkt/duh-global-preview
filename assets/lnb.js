/* ============================================================
   LNB 스크롤스파이 — 한 페이지 안에 여러 섹션(#anchor)이 있는
   서브페이지에서, 현재 보고 있는 섹션에 맞춰 좌측 LNB의 active를
   자동으로 옮긴다. (다른 페이지로 가는 LNB에는 영향 없음)
   ============================================================ */
(function () {
  var lnb = document.querySelector('.lnb');
  if (!lnb) return;

  var page = (location.pathname.split('/').pop() || 'index.html');
  var links = Array.prototype.slice.call(lnb.querySelectorAll('a'));
  var items = [];

  links.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var hashAt = href.indexOf('#');
    var base = hashAt >= 0 ? href.slice(0, hashAt) : href;
    var id = hashAt >= 0 ? href.slice(hashAt + 1) : '';
    // 같은 페이지 링크만 대상 (base 비었거나 현재 파일명과 동일)
    if (base !== '' && base !== page) return;
    var sec = id ? document.getElementById(id) : null;
    items.push({ link: a, sec: sec });
  });

  // 앵커 섹션이 없으면(= 전부 다른 페이지로 가는 LNB) 스파이 불필요
  var hasAnchor = items.some(function (it) { return it.sec; });
  if (items.length < 2 || !hasAnchor) return;

  var headerEl = document.querySelector('.site-header');

  function offset() {
    return (headerEl ? headerEl.getBoundingClientRect().height : 104) + 24;
  }

  function setActive(link) {
    items.forEach(function (it) {
      if (it.link === link) it.link.classList.add('active');
      else it.link.classList.remove('active');
    });
  }

  function onScroll() {
    var line = offset();
    // 페이지 최하단이면 마지막 섹션 활성화
    // (짧은 페이지에서 마지막 섹션이 상단까지 못 올라와 '지났다' 판정이 안 되는 문제 대응)
    var doc = document.documentElement;
    if (window.innerHeight + window.pageYOffset >= doc.scrollHeight - 2) {
      setActive(items[items.length - 1].link);
      return;
    }
    var current = items[0].link; // 아무 것도 안 지났으면 첫 항목
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      // 앵커 없는 자기 자신 링크(최상단)는 항상 '지난' 것으로 취급 → 기본값
      var top = it.sec ? it.sec.getBoundingClientRect().top : -Infinity;
      if (top - line <= 1) current = it.link;
    }
    setActive(current);
  }

  // 클릭 시 즉시 반영(부드러운 스크롤이 끝나기 전에도)
  items.forEach(function (it) {
    it.link.addEventListener('click', function () { setActive(it.link); });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
