/*!
{
  "name": "CSS Generated Content Animations",
  "property": "csspseudoanimations",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testStyles', 'prefixes', 'test/css/animations'], function(Modernizr, testStyles, prefixes) {
  Modernizr.addTest('csspseudoanimations', function() {
    var result = false;

    if (!Modernizr.cssanimations || !window.getComputedStyle) {
      return result;
    }

    var styles = [
      '@', prefixes.join('keyframes csspseudoanimations { from { font-size: 10px; } }@').replace(/\@$/, ''),
      '#modernizr:before { content:" "; font-size:5px;',
      prefixes.join('animation:csspseudoanimations 1ms infinite;'),
      '}'
    ].join('');

    testStyles(styles, function(elem) {
      result = window.getComputedStyle(elem, ':before').getPropertyValue('font-size') === '10px';
    });

    return result;
  });
});
