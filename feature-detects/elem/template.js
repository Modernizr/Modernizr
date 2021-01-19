/*!
{
  "name": "Template Tag",
  "property": "template",
  "caniuse": "template",
  "tags": ["elem"],
  "notes": [{
    "name": "HTML5Rocks Article",
    "href": "https://www.html5rocks.com/en/tutorials/webcomponents/template/"
  }, {
    "name": "W3C Spec",
    "href": "https://web.archive.org/web/20171130222649/http://www.w3.org/TR/html5/scripting-1.html"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('template', 'content' in createElement('template'));

export default Modernizr.template
