/*!
{
  "name": "CSS :invalid pseudo-class",
  "caniuse": "css-sel3",
  "property": "invalid",
  "tags": ["css"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid"
  }],
  "authors": ["@ljharb"]
}
!*/
/* DOC

Detects support for the ':invalid' CSS pseudo-class.

*/
define(['Modernizr'], function( Modernizr ) {
  // querySelector
  Modernizr.addTest('invalid', function() {
    var doc = window.document;
    if(!('querySelectorAll' in doc) ) {
      return false;
    }

    try {
      doc.querySelectorAll(':invalid');
      return true;
    } catch(e) {
      return false;
    }
  });
});

