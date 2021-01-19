/*!
{
  "name": "Pointer Media Query",
  "property": "pointermq"
}
!*/
/* DOC
Detect support for Pointer based media queries
*/
import Modernizr from '../../src/Modernizr.js';
import mq from '../../src/mq.js';

Modernizr.addTest('pointermq', mq(('(pointer:coarse),(pointer:fine),(pointer:none)')));

export default Modernizr.pointermq
