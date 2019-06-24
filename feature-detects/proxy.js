/*!
{
  "name": "Proxy Object",
  "property": "Proxy",
  "caniuse": "proxy",
  "authors": ["Brock Beaudry"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"
  }],
  "polyfills": [
    "harmony-reflect"
  ]
}
!*/
/* DOC
Detects support for the Proxy object which is used to create dynamic proxies.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('proxy', 'Proxy' in window);
});
