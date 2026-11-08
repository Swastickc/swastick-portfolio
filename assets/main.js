/* Swastick Chowdhury — portfolio interactions
   1. One-time fade-and-rise reveal on scroll
   2. Restrained toast feedback for non-navigable actions
   3. Reduced-motion respect
*/

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- one-time reveal ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealNow(el) {
    el.classList.add('is-visible');
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(revealNow);
  } else {
    document.documentElement.classList.add('motion-ready');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          observer.unobserve(entry.target); /* one-time only */
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- toast ---------- */
  var toast = document.querySelector('.site-toast');
  var toastText = toast ? toast.querySelector('p') : null;
  var toastTimer = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 5200);
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest ? event.target.closest('[data-toast]') : null;
    if (!trigger) return;
    event.preventDefault();
    showToast(trigger.getAttribute('data-toast'));
  });

  /* ---------- external links open safely ---------- */
  Array.prototype.forEach.call(
    document.querySelectorAll('a[target="_blank"]'),
    function (link) {
      link.addEventListener('click', function () {
        window.setTimeout(function () { link.blur(); }, 800);
      });
    }
  );
})();
