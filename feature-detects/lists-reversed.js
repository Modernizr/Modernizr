/*!
{
  "name": "Reverse Ordered Lists",
  "property": "olreversed",
  "notes": [{
    "name": "Impressive Webs article",
    "href": "https://www.impressivewebs.com/reverse-ordered-lists-html5/"
  }],
  "builderAliases": ["lists_reversed"]
}
!*/
/* DOC
Detects support for the `reversed` attribute on the `<ol>` element.
*/
import Modernizr from '../src/Modernizr.js';
import createElement from '../src/createElement.js';

Modernizr.addTest('olreversed', 'reversed' in createElement('ol'));

export default Modernizr.olreversed
