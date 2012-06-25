// https://github.com/Modernizr/Modernizr/issues/615
// http://www.inserthtml.com/2012/06/css-filters/
// https://developer.mozilla.org/en/CSS/filter#Gecko_notes
Modernizr.addTest('cssfilters', function() {
    el = document.createElement('div');
    el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
    return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
});