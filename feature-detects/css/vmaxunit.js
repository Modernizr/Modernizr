define(['Modernizr', 'testStyles', 'getStyle'], function( Modernizr, testStyles, getStyle ) {
  // https://github.com/Modernizr/Modernizr/issues/572
  // http://jsfiddle.net/glsee/JDsWQ/4/
  testStyles('#modernizr { width: 50vmax; }', function( elem, rule ) {
    var one_vw = window.innerWidth/100;
    var one_vh = window.innerHeight/100;
    var compWidth = parseInt(getStyle(elem).width ,10);
    Modernizr.addTest('cssvmaxunit', parseInt(Math.max(one_vw, one_vh)*50,10) == compWidth );
  });
});
