/*!
{
  "name": "CSS HSLA Colors",
  "caniuse": "css3-colors",
  "property": "hsla",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import contains from '../../src/contains.js';

Modernizr.addTest('hsla', function() {
  var style = createElement('a').style;
  style.cssText = 'background-color:hsla(120,40%,100%,.5)';
  return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
});

export default Modernizr.hsla
