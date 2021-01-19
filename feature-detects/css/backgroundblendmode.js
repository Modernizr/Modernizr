/*!
{
  "name": "CSS Background Blend Mode",
  "property": "backgroundblendmode",
  "caniuse": "css-backgroundblendmode",
  "tags": ["css"],
  "notes": [{
    "name": "CSS Blend Modes could be the next big thing in Web Design",
    "href": "https://medium.com/@bennettfeely/css-blend-modes-could-be-the-next-big-thing-in-web-design-6b51bf53743a"
  }, {
    "name": "Demo",
    "href": "https://bennettfeely.com/gradients/"
  }]
}
!*/
/* DOC
Detects the ability for the browser to composite backgrounds using blending modes similar to ones found in Photoshop or Illustrator.
*/
import Modernizr from '../../src/Modernizr.js';

import prefixed from '../../src/prefixed.js';
Modernizr.addTest('backgroundblendmode', prefixed('backgroundBlendMode', 'text'));

export default Modernizr.backgroundblendmode
