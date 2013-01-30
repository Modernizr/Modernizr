define(['Modernizr', 'createElement', 'docElement'], function( Modernizr, createElement, docElement ) {
  // developer.mozilla.org/en/CSS/pointer-events

  // Test and project pages:
  // ausi.github.com/Feature-detection-technique-for-pointer-events/
  // github.com/ausi/Feature-detection-technique-for-pointer-events/wiki
  // github.com/Modernizr/Modernizr/issues/80

  Modernizr.addTest('csspointerevents', function() {
    var element = createElement('x');
    var getComputedStyle = window.getComputedStyle;
    var supports;
    if(!('pointerEvents' in element.style)){
      return false;
    }
    element.style.pointerEvents = 'auto';
    element.style.pointerEvents = 'x';
    docElement.appendChild(element);
    supports = getComputedStyle &&
      getComputedStyle(element, '').pointerEvents === 'auto';
    docElement.removeChild(element);
    return !!supports;
  });
});
