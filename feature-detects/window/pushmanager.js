/*!
{
  "name": "PushManager",
  "property": "pushmanager",
  "caniuse": "mdn-api_pushmanager",
  "authors": ["Dawid Kulpa (@dawidkulpa)"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/PushManager"
  }]
}
!*/

/* DOC
Detects support for PushManager.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('pushmanager', 'PushManager' in window);
});
