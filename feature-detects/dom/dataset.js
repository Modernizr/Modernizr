define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // dataset API for data-* attributes
  // test by @phiggins42
  Modernizr.addTest('dataset', function() {
    var n = createElement("div");
    n.setAttribute("data-a-b", "c");
    return !!(n.dataset && n.dataset.aB === "c");
  });
});
