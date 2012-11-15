
// CSS generated content detection
// Android won't return correct height for anything below 7px #738
Modernizr.addTest('generatedcontent', function() {
    var bool,
        mod = 'modernizr',
        smile = ':)';

    Modernizr.testStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:7px/1 a}'].join(''), function( node ) {
      bool = node.offsetHeight >= 7;
    });

    return bool;
});
