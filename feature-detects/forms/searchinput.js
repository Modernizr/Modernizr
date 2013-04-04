define(['Modernizr', 'createElement', 'docElement'], function( Modernizr, createElement, docElement ) {
  // input[type="search"]
  // // Detects if the search input is behaving with -search-cancel-button and recent searches features.
  // // At the time this test was written, only Webkit has implemented it.

  Modernizr.addTest('searchAppearance', function() {
    var appearance, computedAppearance;
    var el = createElement('input');
    el.type = 'search';
    docElement.appendChild(el);

    appearance = Modernizr.prefixed('appearance');
    computedAppearance = window.getComputedStyle(el)[ appearance ];
    Modernizr.searchfield = computedAppearance === 'searchfield'

    docElement.removeChild(el);

    return Modernizr.searchfield;
  });

});
