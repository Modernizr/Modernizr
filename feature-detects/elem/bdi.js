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
define(['Modernizr', 'createElement', 'docElement', 'computedStyle'], function(Modernizr, createElement, docElement, computedStyle) {
  Modernizr.addTest('bdi', function() {
    var div = createElement('div');
    var bdi = createElement('bdi');

    bdi.innerHTML = '&#1573;';
    div.appendChild(bdi);

    docElement.appendChild(div);

    var supports = computedStyle(bdi, null, 'direction') === 'rtl';

    docElement.removeChild(div);

    return supports;
  });
});
