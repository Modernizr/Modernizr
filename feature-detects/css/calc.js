define(['Modernizr', 'createElement', 'prefixes'], function( Modernizr, createElement, prefixes ) {
  // Method of allowing calculated values for length units, i.e. width: calc(100%-3em) http://caniuse.com/#search=calc
  // By @calvein

  Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = createElement('div');

    el.style.cssText = prop + prefixes.join(value + prop);

    return !!el.style.length;
  });

});
