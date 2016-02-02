/*!
{
  "name": "CSS Overflow Scrolling",
  "property": "overflowscrolling",
  "tags": ["css"],
  "builderAliases": ["css_overflow_scrolling"],
  "warnings": ["Introduced in iOS5b2. API is subject to change."],
  "notes": [{
    "name": "Article on iOS overflow scrolling",
    "href": "http://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/"
  }]
}
!*/
/*!
{
  "name": "CSS Overflow Scrolling",
  "property": "overflowscrolling",
  "tags": ["css"],
  "builderAliases": ["css_overflow_scrolling"],
  "warnings": ["Introduced in iOS5b2. API is subject to change."],
  "notes": [{
    "name": "Article on iOS overflow scrolling",
    "href": "http://css-tricks.com/snippets/css/momentum-scrolling-on-ios-overflow-elements/"
  }]
}
!*/
import Modernizr from 'Modernizr';

import testAllProps from 'testAllProps';
Modernizr.addTest('overflowscrolling', testAllProps('overflowScrolling', 'touch', true));