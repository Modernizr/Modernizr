/*!
{
  "name": "Clipboard",
  "property": "clipboard",
  "caniuse": "clipboard",
  "authors": ["Stanley Stuart"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent"
  },
  {
    "name": "Pull Request with Additional Information",
    "href": "https://github.com/Modernizr/Modernizr/pull/659"
  },
  { "name": "Clipboard API Specification",
    "href": "http://www.w3.org/TR/clipboard-apis/"
  },
  {
    "name": "Event Resources",
    "href": "http://www.w3.org/TR/DOM-Level-3-Events/#event-interfaces"
  }]
}
!*/
/* DOC
  This feature detection checks for the ability of a browser to access
  the clipboard to both read data from the clipboard and set the content
  of the clipboard, when the browser's user pastes on a DOM Element
  (for example, an `input` element).
*/
define(['Modernizr'], function( Modernizr ){
  Modernizr.addTest( 'clipboard', function(){
    try {
      // The spec mentions a ClipboardEvent constructor.
      // If the browser implements that, it probably implements the Clipboard API.
      if ( Modernizr.prefixed( 'ClipboardEvent', window, false ) ) return true;
      // otherwise check for a simple onpaste event on the document
      return Modernizr.hasEvent( 'paste', document );
    } catch (e) {
      return false;
    }
  });
});
