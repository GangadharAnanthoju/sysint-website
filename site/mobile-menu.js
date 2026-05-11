/* ── MOBILE MENU ── */

document.addEventListener('DOMContentLoaded', function () {
  var header   = document.querySelector('header');
  var navLinks = document.querySelector('.nav-links');
  var navCta   = document.querySelector('.nav-cta');
  var nav      = document.querySelector('.nav');

  if (!header || !navLinks) return;

  // ── Hamburger button ──
  var btn = document.createElement('button');
  btn.className   = 'hamburger';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML   = '<span></span><span></span><span></span>';
  nav.insertBefore(btn, navCta);

  // ── Mobile drawer ──
  var drawer = document.createElement('nav');
  drawer.className = 'mobile-drawer';

  // Clone all nav links into the drawer
  navLinks.querySelectorAll('a').forEach(function (a) {
    var clone = a.cloneNode(true);
    drawer.appendChild(clone);
  });

  // Add CTA link at the bottom of the drawer
  if (navCta) {
    var ctaClone = document.createElement('a');
    ctaClone.href      = navCta.href;
    ctaClone.textContent = navCta.textContent;
    ctaClone.className = 'drawer-cta';
    drawer.appendChild(ctaClone);
  }

  header.style.position = 'sticky';
  header.appendChild(drawer);

  // ── Toggle ──
  btn.addEventListener('click', function () {
    var isOpen = drawer.classList.contains('open');
    drawer.classList.toggle('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', !isOpen);
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      drawer.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      drawer.classList.remove('open');
      btn.classList.remove('open');
    }
  });
});
