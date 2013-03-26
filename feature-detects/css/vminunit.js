define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // https://github.com/Modernizr/Modernizr/issues/572
  // http://jsfiddle.net/glsee/JRmdq/8/
  testStyles('#modernizr { width: 50vmin; }', function( elem, rule ) {
    var one_vw = window.innerWidth/100;
    var one_vh = window.innerHeight/100;
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle)['width'],10);
    Modernizr.addTest('cssvminunit', parseInt(Math.min(one_vw, one_vh)*50,10) == compWidth );
  });
});
