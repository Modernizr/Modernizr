/*!
{
  "name": "CSS Generated Content Transitions",
  "property": "csspseudotransitions",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import prefixes from '../../src/prefixes.js';
import computedStyle from '../../src/computedStyle.js';
import transitions from './transitions.js';

Modernizr.addTest('csspseudotransitions', function() {
  var result = false;

  if (!transitions) {
    return result;
  }

  var styles =
    '#modernizr:before { content:" "; font-size:5px;' + prefixes.join('transition:0s 100s;') + '}' +
    '#modernizr.trigger:before { font-size:10px; }';

  testStyles(styles, function(elem) {
    // Force rendering of the element's styles so that the transition will trigger
    computedStyle(elem, ':before', 'font-size');
    elem.className += 'trigger';
    result = computedStyle(elem, ':before', 'font-size') === '5px';
  });

  return result;
});

export default Modernizr.csspseudotransitions
