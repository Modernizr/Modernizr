
// documentMode logic from YUI to filter out IE8 Compat Mode
//   which false positives.

Modernizr.addTest('hashchange', isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7));
