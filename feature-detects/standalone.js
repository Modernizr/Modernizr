/*!
{
  "name": "navigator.standalone",
  "property": "standalone",
  "notes": [{
    "name": "Apple Documentation",
    "href": "http://developer.apple.com/library/safari/#documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html"
  }]
}
!*/
define(['Modernizr'], function( Modernizr) {
  Modernizr.addTest('standalone', !!window.navigator.standalone);
});
