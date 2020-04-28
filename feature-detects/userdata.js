/*!
{
  "name": "IE User Data API",
  "property": "userdata",
  "tags": ["storage"],
  "authors": ["@stereobooster"],
  "notes": [{
    "name": "MSDN Documentation",
    "href": "https://msdn.microsoft.com/en-us/library/ms531424.aspx"
  }]
}
!*/
/* DOC
Detects support for IE userData for persisting data, an API similar to localStorage but supported since IE5.
*/
import Modernizr from '../src/Modernizr.js';
import createElement from '../src/createElement.js';

Modernizr.addTest('userdata', !!createElement('div').addBehavior);

export default Modernizr.userdata
