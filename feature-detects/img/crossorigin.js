/*!
{
  "name": "Image crossOrigin",
  "property": "imgcrossorigin",
  "notes": [{
    "name": "Cross Domain Images and the Tainted Canvas",
    "href": "https://blog.codepen.io/2013/10/08/cross-domain-images-tainted-canvas/"
  }]
}
!*/
/* DOC
Detects support for the crossOrigin attribute on images, which allow for cross domain images inside of a canvas without tainting it
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('imgcrossorigin', 'crossOrigin' in createElement('img'));

export default Modernizr.imgcrossorigin
