
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

    setCss(
        // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        (str1 + '-webkit- '.split(' ').join(str2 + str1) +
        // standard syntax             // trailing 'background-image:'
        prefixes.join(str3 + str1)).slice(0, -str1.length)
    );

    return contains(mStyle.backgroundImage, 'gradient');
});
