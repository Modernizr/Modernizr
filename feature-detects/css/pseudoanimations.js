/*!
{
  "name": "CSS Generated Content Animations",
  "property": "csspseudoanimations",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testStyles', 'prefixes', 'test/css/animations', 'computedStyle'], function(Modernizr, testStyles, prefixes, computedStyle) {
  Modernizr.addTest('csspseudoanimations', function() {
    var result = false;

    if (!Modernizr.cssanimations) {
      return result;
    }

    var styles = [
      '@', prefixes.join('keyframes csspseudoanimations { from { font-size: 10px; } }@').replace(/\@$/, ''),
      '#modernizr:before { content:" "; font-size:5px;',
      prefixes.join('animation:csspseudoanimations 1ms infinite;'),
      '}'
    ].join('');

    testStyles(styles, function(elem) {
      result = computedStyle(elem, ':before', 'font-size') === '10px';
    });

    return result;
  });
});
