
//
// One of the most important lack of -webkit-gradient
// versus it's modern successors is angle gradients
// There is no way you can have your gradient work natively
// in a browser that only supports -webkit-gradient
// For example, Blackberry 6 and 7 are a good example
// So, in order to provide fallback for those browsers
// we need this separate test
//
// For differences between
// -webkit-gradient function
// and more specific functions like
// -webkit-linear-gradient or -webkit-radial-gradient
// see:
// https://www.webkit.org/blog/1424/css3-gradients/
//

Modernizr.addTest('cssanglegradients', function() {

    var str1    = 'background-image:',
        str2    = 'linear-gradient(45deg,#9f9, white);',

        css     = Modernizr._prefixes.join(str2 + str1).slice(0, -str1.length),
        elem    = document.createElement('div'),
        style   = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
});
