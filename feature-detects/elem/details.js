define(['Modernizr', 'createElement', 'docElement'], function( Modernizr, createElement, docElement ) {
  // By @mathias, based on http://mths.be/axh
  Modernizr.addTest('details', function() {
    var el = createElement('details');
    var fake;
    if (!('open' in el)) { // return early if possible; thanks @aFarkas!
      return false;
    }
    var root = document.body || (function() {
      fake = true;
      return docElement.insertBefore(createElement('body'), docElement.firstElementChild || docElement.firstChild);
    }());
    el.innerHTML = '<summary>a</summary>b';
    el.style.display = 'block';
    root.appendChild(el);
    var diff = el.offsetHeight;
    el.open = true;
    diff = diff != el.offsetHeight;
    root.removeChild(el);
    fake && root.parentNode.removeChild(root);
    return diff;
  });
});
