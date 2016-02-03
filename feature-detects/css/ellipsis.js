/*!
{
  "name": "CSS text-overflow ellipsis",
  "property": "ellipsis",
  "caniuse": "text-overflow",
  "polyfills": [
    "text-overflow"
  ],
  "tags": ["css"]
}
!*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('ellipsis', testAllProps('textOverflow', 'ellipsis'));
