// Sticky positioning - constrains an element to be positioned inside the
// intersection of its container box, and the viewport.
Modernizr.addTest('csspositionsticky', function () {
    var prop = 'position:',
        value = 'sticky',
        el = document.createElement('modernizr'),
        mStyle = el.style;
    mStyle.cssText = prop + Modernizr._prefixes.join(value + ';' + prop).slice(0, -prop.length);
    return mStyle.position.indexOf(value) !== -1;
});