/*!
{
  "name": "CSS Subpixel Fonts",
  "property": "subpixelfont",
  "tags": ["css"],
  "builderAliases": ["css_subpixelfont"],
  "authors": ["@derSchepp", "@gerritvanaaken", "@rodneyrehm", "@yatil", "@ryanseddon"],
  "notes": [{
    "name": "Origin Test",
    "href": "https://github.com/gerritvanaaken/subpixeldetect"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import computedStyle from '../../src/computedStyle.js';

/*
 * (to infer if GDI or DirectWrite is used on Windows)
 */
testStyles(
  '#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}',
  function(elem) {
    var subpixel = elem.firstChild;
    subpixel.innerHTML = 'This is a text written in Arial';

    Modernizr.addTest('subpixelfont', computedStyle(subpixel, null, 'width') !== '44px');
  }, 1, ['subpixel']);

export default Modernizr.subpixelfont
