/*!
{
  "name": "Video Loop Attribute",
  "property": "videoloop",
  "tags": ["video", "media"]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('videoloop', 'loop' in createElement('video'));
