/*!
{
  "name": "details Element",
  "caniuse": "details",
  "property": "details",
  "tags": ["elem"],
  "builderAliases": ["elem_details"],
  "authors": ["@mathias"],
  "notes": [{
    "name": "Mathias' Original",
    "href": "https://mathiasbynens.be/notes/html5-details-jquery#comment-35"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import testStyles from '../../src/testStyles.js';

Modernizr.addTest('details', function() {
  var el = createElement('details');
  var diff;

  // return early if possible; thanks @aFarkas!
  if (!('open' in el)) {
    return false;
  }

  testStyles('#modernizr details{display:block}', function(node) {
    node.appendChild(el);
    el.innerHTML = '<summary>a</summary>b';
    diff = el.offsetHeight;
    el.open = true;
    diff = diff !== el.offsetHeight;
  });

  return diff;
});

export default Modernizr.details
