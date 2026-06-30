/* filter.js — 필터 탭(.filter-tabs)으로 표/갤러리 항목을 분류별 표시.
   탭 <a data-f="값">, 대상 항목 [data-cat="값"]. data-f="all"이면 전체.
   data-f가 없는 탭(정적 게시판 분류)은 활성 표시만 바뀐다. */
document.querySelectorAll('.filter-tabs').forEach(function (tabs) {
  var scope = tabs.dataset.target
    ? document.querySelector(tabs.dataset.target)
    : (tabs.closest('.content') || document);
  tabs.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      tabs.querySelectorAll('a').forEach(function (x) { x.classList.toggle('on', x === a); });
      var f = a.getAttribute('data-f');
      if (f === null) return;
      scope.querySelectorAll('[data-cat]').forEach(function (it) {
        it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f);
      });
    });
  });
});
