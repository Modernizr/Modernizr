/*!
{
  "name": "microdata",
  "property": "microdata",
  "tags": ["dom"],
  "builderAliases": ["dom_microdata"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/microdata/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import isBrowser from '../../src/isBrowser.js';

Modernizr.addTest('microdata', isBrowser && 'getItems' in document);

export default Modernizr.microdata
