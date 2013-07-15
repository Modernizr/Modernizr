/*!
{
  "name": "Content Editable",
  "property": "contenteditable",
  "caniuse": "contenteditable",
  "notes": [{
    "name": "WHATWG spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable"
  }]
}
!*/
/* DOC

Detects support for the `contenteditable` attribute of elements, allowing their DOM text contents to be edited directly by the user.

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('contenteditable', function() {
    var div = createElement('div');
    div.contentEditable = true;
    return div.contentEditable === "true";
  });
});
