/*!
{
  "name": "Navigation Timing API",
  "property": "performance",
  "caniuse": "nav-timing",
  "tags": ["performance"],
  "authors": ["Scott Murphy (@uxder)"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/navigation-timing/"
  }, {
    "name": "HTML5 Rocks Tutorial",
    "href": "https://www.html5rocks.com/en/tutorials/webperformance/basics/"
  }],
  "polyfills": ["perfnow"]
}
!*/
/* DOC
Detects support for the Navigation Timing API, for measuring browser and connection performance.
*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('performance', !!prefixed('performance', window));
});
