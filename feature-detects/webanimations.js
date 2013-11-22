/*!
{
  "name": "Web Animation API",
  "property": "animation",
  "tags": ["webanimations"],
  "polyfills": ["webanimationsjs"],
  "notes": {
    "name": "Introducing Web Animations",
    "href": "http://brian.sol1.net/svg/2013/06/26/introducing-web-animations/"
  }
}
!*/
/* DOC

Detects support for the Web Animation API, a way to create css animations in js

*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('webanimations', 'Animation' in window);
});
