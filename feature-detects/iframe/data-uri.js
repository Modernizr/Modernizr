/*!
{
  "name": "iframe Data URI support",
  "property": "iframedatauri",
  "caniuse" : "datauri",
  "tags": ["iframe", "data-uri", "datauri"],
  "authors": ["Kevin Martin"],
  "notes": [{
    "name": "Wikipedia article",
    "href": "http://en.wikipedia.org/wiki/Data_URI_scheme"
  }, {
    "name": "Test basis",
    "href": "http://codepen.io/KevinMartin/pen/Kwpmjo?editors=101"
  }],
  "warnings": [
    "This test requires document.body to be present",
    "If a Content-Security-Policy is present, 'data:' (or at least 'data:text/html;base64,Kg==') should be present in the 'frame-src' directive for this test to work correctly."
  ]
}
!*/
/* DOC
When using a data uri as the `src` of an iframe, it should render the content correctly.
*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('iframedatauri', function() {
    var support,
      iframe = document.createElement('iframe');

    iframe.style.display = 'none';
    iframe.setAttribute('src', 'data:text/html;base64,Kg=='); // This can possibly be simplified by using 'data:;base64,' instead

    document.body.appendChild(iframe);

    try {
        support = !!iframe.contentDocument;
    } catch (e) {
        support = false;
    }

    document.body.removeChild(iframe);

    return support;
  });
});
