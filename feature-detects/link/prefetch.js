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
    var relList = createElement("link").relList;
    if (!relList || !relList.supports) {
      return false;
    }

    return relList.supports("prefetch");
  });
});
