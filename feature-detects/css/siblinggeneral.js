/*!
{
  "name": "CSS general sibling selector",
  "caniuse": "css-sel3",
  "property": "siblinggeneral",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/889"
  }]
}
!*/
/*!
{
  "name": "CSS general sibling selector",
  "caniuse": "css-sel3",
  "property": "siblinggeneral",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/889"
  }]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
import testStyles from 'testStyles';
Modernizr.addTest('siblinggeneral', function() {
  return testStyles('#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}', function(elem) {
    return elem.lastChild.offsetWidth == 200;
  }, 2);
});