define(['Modernizr', 'createElement', 'docElement'], function( Modernizr, createElement, docElement ) {
  // input[type="search"]
  // // Detects if the search input is behaving with -search-cancel-button and recent searches features.
  // // At the time this test was written, only Webkit has implemented it.

  Modernizr.addTest('searchApperance', function() {
    var appearance, computedAppearance;
    var el = createElement('input');
    el.type = 'search';
    docElement.appendChild(el);

    appearance = Modernizr.prefixed('appearance');
    computedAppearance = window.getComputedStyle(el)[ appearance ];

    docElement.removeChild(el);

    return computedAppearance === 'searchfield';
  });

});
