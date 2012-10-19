
//
// The Modernizr.touch test only indicates if the browser supports
//    touch events, which does not necessarily reflect a touchscreen
//    device, as evidenced by tablets running Windows 7 or, alas,
//    the Palm Pre / WebOS (touch) phones.
//
// Additionally, Chrome (desktop) used to lie about its support on this,
//    but that has since been rectified: crbug.com/36415
//
// We also test for Firefox 4 Multitouch Support.
//
// For more info, see: modernizr.github.com/Modernizr/touch.html
//

Modernizr.addTest('touch', function() {
    var bool;

    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
    } else {
        var query = ['@media (',Modernizr._prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
        Modernizr.testStyles(query, function( node ) {
            bool = node.offsetTop === 9;
        });
    }

    return bool;
});
