// Method of allowing calculated values for length units, i.e. width: calc(100%-3em) http://caniuse.com/#search=calc
// By @calvein

Modernizr.addTest('csscalc', function(el, prop, value) {
    prop = 'width:';
    value = 'calc(10px);';
    el = document.createElement('div');
    el.style.cssText = prop + Modernizr._prefixes.join(value + prop)
    return !!el.style.length;
});