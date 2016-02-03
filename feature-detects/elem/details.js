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
    "href": "http://mths.be/axh"
  }]
}
!*/
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
    "href": "http://mths.be/axh"
  }]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
import testStyles from 'testStyles';
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
    diff = diff != el.offsetHeight;
  });


  return diff;
});
