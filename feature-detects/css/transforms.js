/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/
/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('csstransforms', function() {
  // Android < 3.0 is buggy, so we sniff and blacklist
  // http://git.io/hHzL7w
  return navigator.userAgent.indexOf('Android 2.') === -1 &&
         testAllProps('transform', 'scale(1)', true);
});