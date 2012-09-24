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
//	Link to **MANUAL** test: http://jsbin.com/igitud/14/edit
// 
//	Using the test above, these browsers have been tested and found to
//		implement the Clipboard API:
//		- Chrome 21
//		- Safari 5.1
//	These browsers have been tested and found to NOT implement Clipboard API:
//		- Firefox 14
//
//	The test below first checks for a ClipboardEvent constructor, then checks
//		for a `clipboardData` property (does not matter whether its value is
//		`undefined` or not) when creating a new Event through the
//		`document.createEvent` interface if the ClipboardEvent constructor
//		is not found.  The W3C does not specify a `clipboardData` property for
//		the `Event` interface, so it is to be considered a less reliable test
//		and only to be used as a last resort.
//
//	The test below has the same results as the manual test above.
//
//	by Stanley Stuart <fivetanley>

Modernizr.addTest( 'clipboard', function(){
  // Earlier versions of Internet Explorer use document.createEventObject
  var create = document.createEvent || document.createEventObject;
  // The spec mentions a ClipboardEvent constructor.
  // If the browser implements that, it probably implements the Clipboard API.
  if ( Modernizr.prefixed( 'ClipboardEvent', window, false ) ) return true;
  // otherwise check for a simple onpaste event on the document
  return Modernizr.hasEvent( 'paste', document );
});
