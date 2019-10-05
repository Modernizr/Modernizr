/*!
{
  "name": "Shadow DOM API",
  "property": "shadowroot",
  "caniuse": "shadowdomv1",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot"
  }],
  "authors": ["Kevin Coyle (@kevin-coyle-unipro)", "Pascal Lim (@pascalim)"],
  "tags": ["dom"]
}
!*/

/* DOC
Detects support for the Shadow DOM API.
*/
define(['Modernizr', 'createElement'], function (Modernizr, createElement) {
  Modernizr.addTest('shadowroot', 'attachShadow' in createElement('div'));
});
