define(['ModernizrProto', 'injectElementWithStyles'], function( ModernizrProto, injectElementWithStyles ) {
  // adapted from matchMedia polyfill
  // by Scott Jehl and Paul Irish
  // gist.github.com/786768
  var testMediaQuery = function( mq ) {

    var matchMedia = window.matchMedia || window.msMatchMedia;
    if ( matchMedia ) {
      return matchMedia(mq).matches;
    }

    var bool;

    injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
      bool = (window.getComputedStyle ?
              getComputedStyle(node, null) :
              node.currentStyle)['position'] == 'absolute';
    });

    return bool;

  };

  // Modernizr.mq tests a given media query, live against the current state of the window
  // A few important notes:
  //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
  //   * A max-width or orientation query will be evaluated against the current state, which may change later.
  //   * You must specify values. Eg. If you are testing support for the min-width media query use:
  //       Modernizr.mq('(min-width:0)')
  // usage:
  // Modernizr.mq('only screen and (max-width:768)')
  ModernizrProto.mq = testMediaQuery;

  return testMediaQuery;
});
