/*!
{
  "name": "Web Animation API",
  "property": "webanimations",
  "caniuse": "web-animation",
  "tags": ["webanimations"],
  "polyfills": ["webanimationsjs"],
  "notes": [{
    "name": "Introducing Web Animations",
    "href": "https://birtles.wordpress.com/2013/06/26/introducing-web-animations/"
  }]
}
!*/
/* DOC
Detects support for the Web Animation API, a way to create css animations in js
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('webanimations', 'animate' in createElement('div'));
});
