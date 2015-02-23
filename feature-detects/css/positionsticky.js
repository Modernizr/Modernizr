/*!
{
  "name": "CSS position: sticky",
  "property": "csspositionsticky",
  "tags": ["css"],
  "builderAliases": ["css_positionsticky"],
  "notes": [
    "using position:sticky on anything but top aligned elements is buggy in Chrome < 37 and iOS <=7+", {
    "name": "Chrome bug report",
    "href":"https://code.google.com/p/chromium/issues/detail?id=322972"
  }]
}
!*/
define(['Modernizr', 'setCss', 'createElement', 'prefixes'], function( Modernizr, setCss, createElement, prefixes ) {
  // Sticky positioning - constrains an element to be positioned inside the
  // intersection of its container box, and the viewport.
  Modernizr.addTest('csspositionsticky', function() {
    var prop = 'position:';
    var value = 'sticky';
    var el = createElement('modernizr');

    setCss(el, prop + prefixes.join(value + ';' + prop).slice(0, -prop.length));

    return el.style.position.indexOf(value) !== -1;
  });
});
