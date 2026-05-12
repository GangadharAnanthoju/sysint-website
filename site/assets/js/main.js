/* ── SYSINT INC — main.js ── */

// ── Nav scroll effect ──
var header = document.querySelector('header');
if (header) {
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu ──
var hamburger  = document.getElementById('nav-hamburger');
var mobileMenu = document.getElementById('nav-mobile');
var closeBtn   = document.getElementById('nav-mobile-close');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  var closeMobile = function () {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMobile);

  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMobile);
  });

  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) closeMobile();
  });
}

// ── Mark active nav link ──
var currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (a) {
  var href = a.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
    a.classList.add('active');
  }
});
