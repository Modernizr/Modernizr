/*!
{
  "name": "CSS Object Fit",
  "caniuse": "object-fit",
  "property": "objectfit",
  "tags": ["css"],
  "builderAliases": ["css_objectfit"],
  "notes": [{
    "name": "Opera Article on Object Fit",
    "href": "https://dev.opera.com/articles/css3-object-fit-object-position/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';

Modernizr.addTest('objectfit', !!prefixed('objectFit'), {aliases: ['object-fit']});

export default Modernizr.objectfit
