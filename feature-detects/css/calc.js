/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "tags": ["css"],
  "builderAliases": ["css_calc"],
  "authors": ["@calvein"]
}
!*/
/* DOC
Method of allowing calculated values for length units. For example:

```css
//lem {
  width: calc(100% - 3em);
}
```
*/
/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "tags": ["css"],
  "builderAliases": ["css_calc"],
  "authors": ["@calvein"]
}
!*/
/* DOC
Method of allowing calculated values for length units. For example:

```css
//lem {
  width: calc(100% - 3em);
}
```
*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
import prefixes from 'prefixes';
Modernizr.addTest('csscalc', function() {
  var prop = 'width:';
  var value = 'calc(10px);';
  var el = createElement('a');

  el.style.cssText = prop + prefixes.join(value + prop);

  return !!el.style.length;
});
