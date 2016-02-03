/*!
{
  "name": "Unknown Elements",
  "property": "unknownelements",
  "tags": ["elem"],
  "notes": [{
    "name": "The Story of the HTML5 Shiv",
    "href": "http://www.paulirish.com/2011/the-history-of-the-html5-shiv/"
  }, {
    "name": "original implementation of detect code",
    "href": "https://github.com/aFarkas/html5shiv/blob/bf4fcc4/src/html5shiv.js#L36"
  }],
  "polyfills": ["html5shiv"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Does the browser support HTML with non-standard / new elements?
*/
/*!
{
  "name": "Unknown Elements",
  "property": "unknownelements",
  "tags": ["elem"],
  "notes": [{
    "name": "The Story of the HTML5 Shiv",
    "href": "http://www.paulirish.com/2011/the-history-of-the-html5-shiv/"
  }, {
    "name": "original implementation of detect code",
    "href": "https://github.com/aFarkas/html5shiv/blob/bf4fcc4/src/html5shiv.js#L36"
  }],
  "polyfills": ["html5shiv"],
  "authors": ["Ron Waldon (@jokeyrhyme)"]
}
!*/
/* DOC
Does the browser support HTML with non-standard / new elements?
*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('unknownelements', function() {
  var a = createElement('a');
  a.innerHTML = '<xyz></xyz>';
  return a.childNodes.length === 1;
});
