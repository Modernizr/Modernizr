/*!
{
  "name": "CSS Stylable Scrollbars",
  "property": "cssscrollbar",
  "tags": ["css"],
  "builderAliases": ["css_scrollbars"]
}
!*/
/*!
{
  "name": "CSS Stylable Scrollbars",
  "property": "cssscrollbar",
  "tags": ["css"],
  "builderAliases": ["css_scrollbars"]
}
!*/
import Modernizr from 'Modernizr';

import testStyles from 'testStyles';
import prefixes from 'prefixes';
testStyles('#modernizr{overflow: scroll; width: 40px; height: 40px; }#' + prefixes
  .join('scrollbar{width:0px}' + ' #modernizr::')
  .split('#')
  .slice(1)
  .join('#') + 'scrollbar{width:0px}',
function(node) {
  Modernizr.addTest('cssscrollbar', node.scrollWidth == 40);
});