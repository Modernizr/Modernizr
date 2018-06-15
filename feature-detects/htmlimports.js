/*!
{
  "name": "HTML Imports",
  "property": "htmlimports",
  "tags": ["html", "import"],
  "polyfills": ["polymer-htmlimports"],
  "notes": [{
      "name": "W3C HTML Imports Specification",
      "href": "https://w3c.github.io/webcomponents/spec/imports/"
    }, {
      "name": "HTML Imports - #include for the web",
      "href": "https://www.html5rocks.com/en/tutorials/webcomponents/imports/"
  }]
}
!*/
/* DOC
Detects support for HTML import, a feature that is used for loading in Web Components.
 */
define(['addTest', 'createElement'], function(addTest, createElement) {
  addTest('htmlimports', 'import' in createElement('link'));
});
