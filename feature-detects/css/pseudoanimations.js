/*!
{
  "name": "CSS Generated Content Animations",
  "property": "csspseudoanimations",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testStyles', 'getStyle', 'test/css/animations'], function (Modernizr, testStyles, getStyle) {
  Modernizr.addTest('csspseudoanimations', function () {
    var result = false;

    if (!Modernizr.cssanimations) {
      return result;
    }

    var styles = [
      '@', Modernizr._prefixes.join('keyframes csspseudoanimations { from { font-size: 10px; } }@').replace(/\@$/,''),
      '#modernizr:before { content:" "; font-size:5px;',
      Modernizr._prefixes.join('animation:csspseudoanimations 1ms infinite;'),
      '}'
    ].join('');

    testStyles(styles, function (elem) {
      result = getStyle(elem, ':before')['font-size'] === '10px';
    });

    return result;
  });
});
