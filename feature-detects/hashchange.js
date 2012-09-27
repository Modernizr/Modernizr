

Modernizr.addTest('hashchange', function(){

  if (Modernizr.hasEvent('hashchange', window) === false) return false;

  // documentMode logic from YUI to filter out IE8 Compat Mode
  //   which false positives.
  return (document.documentMode === undefined || document.documentMode > 7);

});
