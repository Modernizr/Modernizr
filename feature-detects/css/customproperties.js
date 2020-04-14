/*!
{
  "name": "CSS Custom Properties",
  "property": "customproperties",
  "caniuse": "css-variables",
  "tags": ["css"],
  "builderAliases": ["css_customproperties"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/--*"
  }, {
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/css-variables/"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

var supportsFn = (_globalThis.CSS && _globalThis.CSS.supports.bind(_globalThis.CSS)) || (_globalThis.supportsCSS);
Modernizr.addTest('customproperties', !!supportsFn && (supportsFn('--f:0') || supportsFn('--f', 0)));

export default Modernizr.customproperties
