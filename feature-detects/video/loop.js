/*!
{
  "name": "Video Loop Attribute",
  "property": "videoloop",
  "tags": ["video", "media"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('videoloop', 'loop' in createElement('video'));

export default Modernizr.videoloop
