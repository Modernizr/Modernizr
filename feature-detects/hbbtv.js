/*!
{
  "name": "HbbTV",
  "property": "hbbtv",
  "caniuse": "hbbtv",
  "tags": ["hbbtv"]
}
!*/
/* DOC
TODO
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('hbbtv', !!navigator.userAgent.match(/(HbbTV|Opera TV)/i));
});
