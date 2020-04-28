/*!
{
  "name": "Hover Media Query",
  "property": "hovermq"
}
!*/
/* DOC
Detect support for Hover based media queries
*/
import Modernizr from '../../src/Modernizr.js';
import mq from '../../src/mq.js';

Modernizr.addTest('hovermq', mq('(hover)'));

export default Modernizr.hovermq
