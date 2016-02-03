/*!
{
  "name": "dataset API",
  "caniuse": "dataset",
  "property": "dataset",
  "tags": ["dom"],
  "builderAliases": ["dom_dataset"],
  "authors": ["@phiggins42"]
}
!*/
/*!
{
  "name": "dataset API",
  "caniuse": "dataset",
  "property": "dataset",
  "tags": ["dom"],
  "builderAliases": ["dom_dataset"],
  "authors": ["@phiggins42"]
}
!*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
// dataset API for data-* attributes
Modernizr.addTest('dataset', function() {
  var n = createElement('div');
  n.setAttribute('data-a-b', 'c');
  return !!(n.dataset && n.dataset.aB === 'c');
});
