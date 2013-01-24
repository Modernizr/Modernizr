
//
// For CSS Gradients syntax, please see:
// webkit.org/blog/175/introducing-css-gradients/
// developer.mozilla.org/en/CSS/-moz-linear-gradient
// developer.mozilla.org/en/CSS/-moz-radial-gradient
// dev.w3.org/csswg/css3-images/#gradients-
//

Modernizr.addTest('cssgradients', function() {

    var str1 = 'background-image:',
        str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
        str3 = 'linear-gradient(left top,#9f9, white);';

    var css =
        // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        (str1 + '-webkit- '.split(' ').join(str2 + str1) +
        // standard syntax             // trailing 'background-image:'
        Modernizr._prefixes.join(str3 + str1)).slice(0, -str1.length);

    var elem = document.createElement('div');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
});
