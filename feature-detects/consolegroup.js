/*!
{
  "name": "Console Group Methods",
  "property": "console.group",
  "caniuse" : "console.group",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en/docs/Web/API/console.group"
  }, {
    "name": "IEDC documentation",
    "href": "http://msdn.microsoft.com/en-us/library/ie/dn265068(v=vs.85).aspx"
  }]
}
!*/
/* DOC
Detects support for the console.group method and by extension support for console.groupEnd and console.groupCollapsed.
*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest(
    'consolegroup',
    (typeof console.group == 'function')
  );
});
