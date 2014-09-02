//	Modernizr Issue: https://github.com/Modernizr/Modernizr/issues/605
//
//	This feature detection checks for the ability of a browser to access
//		the clipboard to both read data from the clipboard and set the content
//		of the clipboard, when the browser's user pastes on a DOM Element
//		(for example, an `input` element).
//
//  Specification for Clipboard API: http://www.w3.org/TR/clipboard-apis/
//	DataTransfer Interface:
//		http://www.w3.org/TR/html5/dnd.html#the-datatransfer-interface
//	Event Interfaces: http://www.w3.org/TR/DOM-Level-3-Events/#event-interfaces
//
//	See the pull request for more info on why an **accurate** test must be run
//		manually.
//
//		Pull Request: https://github.com/Modernizr/Modernizr/pull/659
//
//	Using the test above, these browsers have been tested and found to
//		implement the Clipboard API:
//		- Chrome 21
//		- Safari 5.1
//
//	The test below first checks for a ClipboardEvent constructor, then checks
//		for a `paste` event on the `document` object if the ClipboardEvent
//		constructor is not found.
//
//	The test below has the same results as the manual test above.
//
//	by Stanley Stuart <fivetanley>

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
