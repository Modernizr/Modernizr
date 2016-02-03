/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "caniuse": "css-transitions",
  "tags": ["css"]
}
!*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('csstransitions', testAllProps('transition', 'all', true));
