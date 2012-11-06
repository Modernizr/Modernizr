define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // https://github.com/Modernizr/Modernizr/issues/572
  // http://jsfiddle.net/FWeinb/etnYC/
  testStyles('#modernizr { width: 50vw; }', function( elem, rule ) {
    var width = parseInt(window.innerWidth/2,10);
    var compStyle = parseInt((window.getComputedStyle ?
                              getComputedStyle(elem, null) :
                              elem.currentStyle)['width'],10);

    Modernizr.addTest('cssvwunit', compStyle == width);
  });
});
