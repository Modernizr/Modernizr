/*!
{
  "name": "CSS Overflow Scrolling",
  "property": "overflowscrolling",
  "tags": ["css"],
  "builderAliases": ["css_overflow_scrolling"],
  "notes": [{
    "name": "Article on iOS overflow scrolling",
    "href": "https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

Modernizr.addTest('overflowscrolling', testAllProps('overflowScrolling', 'touch', true));

export default Modernizr.overflowscrolling
