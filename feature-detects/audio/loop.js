/*!
{
  "name": "Audio Loop Attribute",
  "property": "audioloop",
  "tags": ["audio", "media"]
}
!*/
/* DOC
Detects if an audio element can automatically restart, once it has finished
*/
import Modernizr from '../../src/Modernizr.js';

import createElement from '../../src/createElement.js';
Modernizr.addTest('audioloop', 'loop' in createElement('audio'));

export default Modernizr.audioloop;
