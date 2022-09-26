/*!
{
  "name": "aspectration css property",
  "property": "aspectratio",
  "tags": ["css aspectration", "aspect-ratio"],
  "builderAliases": ["aspectratio"],
  "authors": ["Debadutta Panda"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio"
  }]
}
!*/
/* DOC
Detect working status of all aspectratio css property
*/
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
 */
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest("aspectratio", function () {
    const element = document.createElement('p');
    if ('aspectRatio' in element.style) {
      element.remove();
      return true;
    } else {
      element.remove();
      return false;
    }
  });
});