/*!
{
  "name": "bdi Element",
  "property": "bdi",
  "notes": [{
    "name": "MDN Overview",
    "href": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi"
  }]
}
!*/
/* DOC
Detect support for the bdi element, a way to have text that is isolated from its possibly bidirectional surroundings
*/
define(['Modernizr', 'createElement', 'docElement', 'isSVG'], function(Modernizr, createElement, docElement, isSVG) {
  Modernizr.addTest('bdi', function() {
    var div = createElement('div');
    var bdi = createElement('bdi');
    var value = '&#1573';

    if (isSVG) {
      value = 'إ';
    }

    bdi.innerHTML = value;
    div.appendChild(bdi);

    docElement.appendChild(div);

    var supports = ((window.getComputedStyle ?
          getComputedStyle(bdi, null) :
          bdi.currentStyle).direction === 'rtl');

    docElement.removeChild(div);

    return supports;
  });
});
