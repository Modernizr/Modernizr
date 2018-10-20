/*!
{
  "name": "[hidden] Attribute",
  "property": "hidden",
  "tags": ["dom"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/dev/interaction.html#the-hidden-attribute"
  }, {
    "name": "original implementation of detect code",
    "href": "https://github.com/aFarkas/html5shiv/blob/bf4fcc4/src/html5shiv.js#L38"
  }],
  "polyfills": ["html5shiv"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Does the browser support the HTML5 [hidden] attribute?
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('hidden', 'hidden' in createElement('a'));
});
