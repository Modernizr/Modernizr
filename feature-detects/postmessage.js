/*!
{
  "name": "postMessage",
  "property": "postmessage",
  "caniuse": "x-doc-messaging",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/webmessaging/#crossDocumentMessages"
  }],
  "polyfills": ["easyxdm", "postmessage-jquery"],
  "knownBugs": ["structuredclones - Android 2&3 can not send a structured clone of dates, filelists or regexps"],
  "warnings": ["Some old WebKit versions have bugs. Stick with object, array, number and pixeldata to be safe."]
}
!*/
/* DOC
Detects support for the `window.postMessage` protocol for cross-document messaging.
`Modernizr.postmessage.structuredclones` reports if `postMessage` can send objects.
*/
define(['Modernizr'], function( Modernizr ) {
  var bool = true;
  try {
    window.postMessage({ toString: function () { bool = false; } }, '*');
  } catch (e) {}

  Modernizr.addTest('postmessage', new Boolean('postMessage' in window));
  Modernizr.addTest('postmessage.structuredclones', bool);
});
