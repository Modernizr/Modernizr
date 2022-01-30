/*!
{
  "name": "rel=prefetch",
  "property": "prefetch",
  "caniuse": "link-rel-prefetch",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/resource-hints/#prefetch"
  }, {
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/2536"
  }]
}
!*/
/* DOC
Test for resource hints: prefetch.
*/
define(["Modernizr", "createElement"], function (Modernizr, createElement) {
  Modernizr.addTest("prefetch", function() {
    if (document.documentMode === 11) {
      // Need to check specifically for IE11 as it supports prefetch, but not relList
      // https://github.com/Modernizr/Modernizr/pull/2610#issuecomment-709717161
      return true;
    }

    var relList = createElement("link").relList;
    if (!relList || !relList.supports) {
      return false;
    }

    return relList.supports("prefetch");
  });
});
