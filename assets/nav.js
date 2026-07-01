/* nav.js — 모바일 햄버거 메뉴 토글 */
document.querySelectorAll('.nav-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var h = document.querySelector('.site-header');
    var open = h.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var ic = btn.querySelector('i');
    if (ic) ic.className = open ? 'ti ti-x' : 'ti ti-menu-2';
  });
});
