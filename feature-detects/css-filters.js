// https://github.com/Modernizr/Modernizr/issues/614
// http://www.inserthtml.com/2012/06/css-filters/

Modernizr.addTest('cssfilters', function() {
    el = document.createElement('div');
    el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
    return !!el.style.length;
});