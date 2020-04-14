/*!
{
  "name": "DataView",
  "property": "dataview",
  "authors": ["Addy Osmani"],
  "builderAliases": ["dataview_api"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/JavaScript_typed_arrays/DataView"
  }],
  "polyfills": ["jdataview"]
}
!*/
/* DOC
Detects support for the DataView interface for reading data from an ArrayBuffer as part of the Typed Array spec.
*/
import Modernizr from '../src/Modernizr.js';

Modernizr.addTest('dataview', (typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype));

export default Modernizr.dataview
