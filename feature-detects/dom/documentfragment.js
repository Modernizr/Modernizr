/*!
{
  "name": "Document Fragment",
  "property": "documentfragment",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-B63ED1A3"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment"
  }, {
    "name": "QuirksMode Compatibility Tables",
    "href": "https://www.quirksmode.org/m/w3c_core.html#t112"
  }],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": ["false-positive on Blackberry 9500, see QuirksMode note"],
  "tags": ["dom"]
}
!*/
/* DOC
Append multiple elements to the DOM within a single insertion.
*/
define(['Modernizr', 'docElement'], function(Modernizr, docElement) {
  Modernizr.addTest('documentfragment', function() {
    return 'createDocumentFragment' in document &&
      'appendChild' in docElement;
  });
});

