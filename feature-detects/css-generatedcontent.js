
// CSS generated content detection
Modernizr.addTest('generatedcontent', function() {
    var bool,
        mod = 'modernizr',
        smile = ':)';

    Modernizr.testStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
      bool = node.offsetHeight >= 3;
    });

    return bool;
});
