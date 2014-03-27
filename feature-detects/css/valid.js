/*!
{
  "name": "CSS :valid pseudo-class",
  "caniuse": "css-sel3",
  "property": "valid",
  "tags": ["css"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:valid"
  }],
  "authors": ["@ljharb"]
}
!*/
/* DOC

Detects support for the ':valid' CSS pseudo-class.

*/
define(['Modernizr'], function( Modernizr ) {
  // querySelector
  Modernizr.addTest('valid', function() {
    var doc = window.document;
    if(!('querySelectorAll' in doc) ) {
      return false;
    }

    try {
      doc.querySelectorAll(':valid');
      return true;
    } catch(e) {
      return false;
    }
  });
});

