/*!
{
  "name": "CSS Calc",
  "property": "csscalc",
  "caniuse": "calc",
  "aliases": [],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["@calvein"],
  "warnings": [],
  "notes": []
}
!*/
/* DOC
Method of allowing calculated values for length units, i.e. width: calc(100%-3em)
*/
define(['Modernizr', 'createElement', 'prefixes'], function( Modernizr, createElement, prefixes ) {
  Modernizr.addTest('csscalc', function() {
    var prop = 'width:';
    var value = 'calc(10px);';
    var el = createElement('div');

    el.style.cssText = prop + prefixes.join(value + prop);

    return !!el.style.length;
  });
});
