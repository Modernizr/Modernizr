/*!
{
  "name": "CSS Overflow Scrolling",
  "property": "overflowscrolling",
  "tags": ["css"],
  "builderAliases": ["css_overflow_scrolling"],
  "warnings": ["Introduced in iOS5b2. API is subject to change."],
  "notes": [{
    "name": "Article on iOS overflow scrolling",
    "href": "https://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';

Modernizr.addTest('overflowscrolling', testAllProps('overflowScrolling', 'touch', true));

export default Modernizr.overflowscrolling
