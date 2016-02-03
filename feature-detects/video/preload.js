/*!
{
  "name": "Video Preload Attribute",
  "property": "videopreload",
  "tags": ["video", "media"]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('videopreload', 'preload' in createElement('video'));
