/*!
{
  "name": "Content Editable",
  "property": "contenteditable",
  "caniuse": "contenteditable",
  "knownBugs": ["This is known to false positive in some mobile browsers. Here is a whitelist of verified working browsers: http://bit.ly/15RIQ9A"],
  "notes": [{
    "name": "WHATWG spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable"
  }]
}
!*/
/* DOC

Detects support for the `contenteditable` attribute of elements, allowing their DOM text contents to be edited directly by the user.

*/
define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  Modernizr.addTest('contenteditable', 'contentEditable' in docElement);
});
