/*!
{
  "name": "Blob constructor",
  "property": "blobconstructor",
  "aliases": ["blob-constructor"],
  "builderAliases": ["blob_constructor"],
  "caniuse": "blobbuilder",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/FileAPI/#constructorBlob"
  }],
  "polyfills": ["blobjs"]
}
!*/
/* DOC
Detects support for the Blob constructor, for creating file-like objects of immutable, raw data.
*/
import Modernizr from '../src/Modernizr.js';

Modernizr.addTest('blobconstructor', function() {
  try {
    return !!new Blob();
  } catch (e) {
    return false;
  }
}, {
  aliases: ['blob-constructor']
});

export default Modernizr.blobconstructor;
