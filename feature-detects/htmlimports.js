/*!
{
  "name": "HTML Imports",
  "notes": [
    {
      "name": "W3C HTML Imports Specification",
      "href": "http://w3c.github.io/webcomponents/spec/imports/"
    },
    {
      "name": "HTML Imports - #include for the web",
      "href": "http://www.html5rocks.com/en/tutorials/webcomponents/imports/"
    }
  ],
  "polyfills": ["polymer-htmlimports"],
  "property": "htmlimports",
  "tags": ["html", "import"]
}
!*/
/* DOC
Detects support for HTML import, a feature that is used for loading in Web Components.
 */

define(['Modernizr'], function ( Modernizr ) {
  Modernizr.addTest('htmlimports', 'import' in document.createElement('link'));
});
