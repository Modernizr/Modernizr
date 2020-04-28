/*!
{
  "name": "CSS Transforms",
  "property": "csstransforms",
  "caniuse": "transforms2d",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';
import contains from '../../src/contains.js';

Modernizr.addTest('csstransforms', function() {
  // Android < 3.0 is buggy, so we sniff and blacklist
  // https://github.com/Modernizr/Modernizr/issues/903
  return contains(navigator.userAgent, 'Android 2.') &&
         testAllProps('transform', 'scale(1)', true);
});

export default Modernizr.csstransforms
