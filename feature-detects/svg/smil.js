
// SVG SMIL animation
Modernizr.addTest('smil', function() {
    return !!document.createElementNS &&
            /SVGAnimate/.test(toString.call(document.createElementNS('http://www.w3.org/2000/svg', 'animate')));
});
