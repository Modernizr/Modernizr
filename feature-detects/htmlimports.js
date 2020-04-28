/*!
{
  "name": "HTML Imports",
  "property": "htmlimports",
  "tags": ["html", "import"],
  "polyfills": ["polymer-htmlimports"],
  "notes": [{
    "name": "W3C Spec",
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
import Modernizr from '../src/Modernizr.js';
import createElement from '../src/createElement.js';

Modernizr.addTest('htmlimports', 'import' in createElement('link'));

export default Modernizr.htmlimports
