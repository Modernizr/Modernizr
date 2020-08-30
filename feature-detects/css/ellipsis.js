/*!
{
  "name": "CSS text-overflow ellipsis",
  "property": "ellipsis",
  "caniuse": "text-overflow",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

Modernizr.addTest('ellipsis', testAllProps('textOverflow', 'ellipsis'));

export default Modernizr.ellipsis
