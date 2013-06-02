/*!
{
  "name": "Web Intents",
  "property": "webintents",
  "authors": ["Eric Bidelman"],
  "notes": [{
    "Web Intents project site",
    "http://webintents.org/"
  }],
  "polyfills": [{
    "name": "Web Intents JavaScript shim",
    "href": "http://webintents.org/#javascriptshim"
  }]
}
!*/
/* DOC

Detects native support for the Web Intents APIs for service discovery and inter-application communication.

Chrome added support for this in v19, but [removed it again in v24](http://lists.w3.org/Archives/Public/public-web-intents/2012Nov/0000.html) because of "a number of areas for
development in both the API and specific user experience in Chrome". No other browsers currently support it, however a [JavaScript shim](http://webintents.org/#javascriptshim) is available.

*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  Modernizr.addTest('webintents', !!prefixed('startActivity', navigator));
});
