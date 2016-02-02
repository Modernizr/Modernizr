/*!
{
  "name": "microdata",
  "property": "microdata",
  "tags": ["dom"],
  "builderAliases": ["dom_microdata"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://www.w3.org/TR/html5/microdata.html"
  }]
}
!*/
/*!
{
  "name": "microdata",
  "property": "microdata",
  "tags": ["dom"],
  "builderAliases": ["dom_microdata"],
  "notes": [{
    "name": "W3 Spec",
    "href": "http://www.w3.org/TR/html5/microdata.html"
  }]
}
!*/
import Modernizr from 'Modernizr';

Modernizr.addTest('microdata', 'getItems' in document);