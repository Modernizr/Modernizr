// cubic-bezier values can't be > 1 for Webkit until bug #45761 (https://bugs.webkit.org/show_bug.cgi?id=45761) is fixed
// By @calvein

Modernizr.addTest('csscalc', function(el, prop, value) {
    prop = 'width:';
    value = 'calc(10px);';
    el = document.createElement('div');
    el.style.cssText = prop + Modernizr._prefixes.join(value + prop)
    return !!el.style.length;
});