/*!
{
  "name": "Backdrop Filter",
  "property": "backdropfilter",
  "authors": ["Brian Seward"],
  "tags": ["css"],
  "caniuse": "css-backdrop-filter",
  "notes": [{
      "name": "W3C Editor’s Draft Spec",
      "href": "https://drafts.fxtf.org/filters-2/#BackdropFilterProperty"
    },{
      "name": "WebKit Blog introduction + Demo",
      "href": "https://www.webkit.org/blog/3632/introducing-backdrop-filters/"
  }]
}
!*/
/* DOC
Detects support for CSS Backdrop Filters, allowing for background blur effects like those introduced in iOS 7. Support for this was added to iOS Safari/WebKit in iOS 9.
*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('backdropfilter', testAllProps('backdropFilter'));
});
