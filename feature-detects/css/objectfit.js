/*!
{
  "name": "CSS Object Fit",
  "caniuse": "object-fit",
  "property": "objectfit",
  "tags": ["css"],
  "builderAliases": ["css_objectfit"],
  "notes": [{
    "name": "Opera Article on Object Fit",
    "href": "http://dev.opera.com/articles/view/css3-object-fit-object-position/"
  }]
}
!*/
/*!
{
  "name": "CSS Object Fit",
  "caniuse": "object-fit",
  "property": "objectfit",
  "tags": ["css"],
  "builderAliases": ["css_objectfit"],
  "notes": [{
    "name": "Opera Article on Object Fit",
    "href": "http://dev.opera.com/articles/view/css3-object-fit-object-position/"
  }]
}
!*/
import Modernizr from 'Modernizr';

import prefixed from 'prefixed';
Modernizr.addTest('objectfit', !!prefixed('objectFit'), {aliases: ['object-fit']});