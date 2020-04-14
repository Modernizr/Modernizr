/*!
{
  "name": "time Element",
  "property": "time",
  "tags": ["elem"],
  "builderAliases": ["elem_time"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('time', 'valueAsDate' in createElement('time'));

export default Modernizr.time
