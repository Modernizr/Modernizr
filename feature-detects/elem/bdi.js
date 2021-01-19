/*!
{
  "name": "bdi Element",
  "property": "bdi",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi"
  }]
}
!*/
/* DOC
Detect support for the bdi element, a way to have text that is isolated from its possibly bidirectional surroundings
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import docElement from '../../src/docElement.js';
import computedStyle from '../../src/computedStyle.js';

Modernizr.addTest('bdi', function() {
  var div = createElement('div');
  var bdi = createElement('bdi');

  bdi.innerHTML = '&#1573;';
  div.appendChild(bdi);

  docElement.appendChild(div);

  var supports = computedStyle(bdi, null, 'direction') === 'rtl';

  docElement.removeChild(div);

  return supports;
});

export default Modernizr.bdi
