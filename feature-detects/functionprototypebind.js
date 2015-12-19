/*!
{
  "name": "Bind of Function.prototype",
  "property": "functionprototypebind",
  "caniuse": "functionprototypebind",
  "tags": ["bind"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind"
  }]
}
!*/
/* DOC
Detects support for 'bind' method of Function.prototype, as some browser do not support it.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('functionprototypebind', 'bind' in window.Function.prototype);
});
