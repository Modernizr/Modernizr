/*!
{
  "name": "CSS HSLA Colors",
  "caniuse": "css3-colors",
  "property": "hsla",
  "tags": ["css"]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
import contains from 'contains';
Modernizr.addTest('hsla', function() {
  var style = createElement('a').style;
  style.cssText = 'background-color:hsla(120,40%,100%,.5)';
  return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
});
