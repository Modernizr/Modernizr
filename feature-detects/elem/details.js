define(['Modernizr', 'createElement', 'docElement', 'testStyles'], function( Modernizr, createElement, docElement, testStyles ) {
  // By @mathias, based on http://mths.be/axh
  Modernizr.addTest('details', function() {
    var el = createElement('details');
    var diff;

    if (!('open' in el)) { // return early if possible; thanks @aFarkas!
      return false;
    }

    testStyles('#modernizr details{display:block}', function( node ) {
      node.appendChild(el);
      el.innerHTML = '<summary>a</summary>b';
      diff = el.offsetHeight;
      el.open = true;
      diff = diff != el.offsetHeight;
    });


    return diff;
  });
});
