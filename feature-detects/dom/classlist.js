/*!
{
  "name": "classList",
  "caniuse": "classlist",
  "property": "classlist",
  "tags": ["dom"],
  "builderAliases": ["dataview_api"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/DOM/element.classList"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import docElement from '../../src/docElement.js';
import isBrowser from '../../src/isBrowser.js';

Modernizr.addTest('classlist', isBrowser && 'classList' in docElement);

export default Modernizr.classlist
