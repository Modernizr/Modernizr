/*!
{
  "name": "input[directory] Attribute",
  "property": "directory",
  "authors": ["silverwind"],
  "tags": ["file", "input", "attribute"]
}
!*/
/* DOC
When used on an `<input type="file">`, the `directory` attribute instructs
the user agent to present a directory selection dialog instead of the usual
file selection dialog.
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import domPrefixesAll from '../../src/domPrefixesAll.js';

Modernizr.addTest('fileinputdirectory', function() {
  var elem = createElement('input'), dir = 'directory';
  elem.type = 'file';
  for (var i = 0, len = domPrefixesAll.length; i < len; i++) {
    if (domPrefixesAll[i] + dir in elem) {
      return true;
    }
  }
  return false;
});

export default Modernizr.fileinputdirectory
