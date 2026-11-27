// Saintly Ponderings: how much of an article fits beside its photo.
// Rule: a paragraph may end up to 2 lines below the bottom of the photo; the first one that
// runs further, and everything after it, continues on the article's own page.
// Used by the homepage (real rows) and by article pages (an invisible copy of the row layout),
// so both always agree at the reader's screen width.
(function () {
  var DESKTOP = '(min-width: 900px)';

  // feature: a .row-feature element containing .row-pic and .row-text > .row-body
  function fitCount(feature) {
    var pic = feature.querySelector('.row-pic');
    var body = feature.querySelector('.row-body');
    if (!body) return 0;
    var blocks = body.children;
    if (!pic) return 0;                       // no photo: whole text goes to the article page
    if (!blocks.length) return 0;
    var lh = parseFloat(getComputedStyle(blocks[0]).lineHeight) || 24;
    var limit = pic.getBoundingClientRect().bottom + 2 * lh + 0.5;
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].getBoundingClientRect().bottom > limit) return i;
    }
    return blocks.length;
  }

  function whenReady(fn) {
    var run = function () { fn(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else window.addEventListener('load', run);
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(run, 150); });
  }

  // Homepage: hide what doesn't fit; rows with nothing more to read lose their arrow and link (desktop).
  window.SPLayoutRows = function () {
    if (!matchMedia(DESKTOP).matches) return;
    document.querySelectorAll('a.row').forEach(function (row) {
      var feature = row.querySelector('.row-feature');
      if (!feature || !row.offsetParent) return;   // hidden behind an "All..." button: done when shown
      var blocks = feature.querySelectorAll('.row-body > *');
      blocks.forEach(function (b) { b.classList.remove('cut'); });
      var n = fitCount(feature);
      for (var i = n; i < blocks.length; i++) blocks[i].classList.add('cut');
      row.classList.toggle('no-overflow', n >= blocks.length);
    });
  };

  // Article page: on desktop, skip the paragraphs the homepage already shows beside the photo.
  window.SPLayoutArticle = function () {
    var probe = document.querySelector('.fit-probe');
    var shown = document.querySelectorAll('.head-text > *');
    if (!probe) return;
    shown.forEach(function (b) { b.classList.remove('on-home'); });
    var n = fitCount(probe.querySelector('.row-feature'));
    for (var i = 0; i < n && i < shown.length; i++) shown[i].classList.add('on-home');
  };

  window.SPWhenReady = whenReady;
})();
