/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
  "notes": [{
    "name": "W3C Gradient Spec",
    "href": "dev.w3.org/csswg/css3-images/#gradients"
  }]
}
!*/
define(['Modernizr', 'prefixes', 'createElement'], function( Modernizr, prefixes, createElement ) {
  Modernizr.addTest('cssgradients', function() {
    var property = 'background-image:';
    var value = 'linear-gradient(left top,#9f9, white);';
    var css = (property + prefixes.join(value + property)).slice(0, -property.length);
    var elem = createElement('div');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });
});
