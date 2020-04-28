/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "https://css-tricks.com/rgba-browser-support/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import contains from '../../src/contains.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('rgba', function() {
  var style = createElement('a').style;
  style.cssText = 'background-color:rgba(150,255,150,.5)';

  return contains('' + style.backgroundColor, 'rgba')
});

export default Modernizr.rgba
