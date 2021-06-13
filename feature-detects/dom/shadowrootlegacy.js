/*!
{
  "name": "Shadow DOM API (Legacy)",
  "property": "shadowrootlegacy",
  "caniuse": "shadowdom",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Element/createShadowRoot"
  }],
  "authors": ["Kevin Coyle (@kevin-coyle-unipro)", "Pascal Lim (@pascalim)"],
  "tags": ["dom"]
}
!*/

/* DOC
Detects support for the Shadow DOM API. (Legacy)
*/
define(['Modernizr', 'createElement'], function (Modernizr, createElement) {
  Modernizr.addTest('shadowrootlegacy', 'createShadowRoot' in createElement('div'));
});
