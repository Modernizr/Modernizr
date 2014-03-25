/*!
{
  "name": "details Element",
  "caniuse": "details",
  "property": "details",
  "tags": ["elem"],
  "authors": ["@mathias"],
  "notes": [{
    "name": "Mathias' Original",
    "href": "http://mths.be/axh"
  }]
}
!*/
define(['Modernizr', 'createElement', 'docElement', 'testStyles'], function( Modernizr, createElement, docElement, testStyles ) {
  Modernizr.addTest('details', function() {
    var el = createElement('details');
    var diff;

    // return early if possible; thanks @aFarkas!
    if (!('open' in el)) {
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
