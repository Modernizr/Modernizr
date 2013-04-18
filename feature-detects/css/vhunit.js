define(['Modernizr', 'testStyles', 'getStyle'], function( Modernizr, testStyles, getStyle ) {
  // https://github.com/Modernizr/Modernizr/issues/572
  // Similar to http://jsfiddle.net/FWeinb/etnYC/
  testStyles('#modernizr { height: 50vh; }', function( elem, rule ) {
    var height = parseInt(window.innerHeight/2,10);
    var compStyle = parseInt(getStyle(elem).height ,10);
    Modernizr.addTest('cssvhunit', compStyle == height);
  });
});
