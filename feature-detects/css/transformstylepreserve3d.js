/*!
{
  "name": "CSS Transform Style preserve-3d",
  "property": "preserve3d",
  "authors": ["denyskoch", "aFarkas"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/1748"
  }]
}
!*/
/* DOC
Detects support for `transform-style: preserve-3d`, for getting a proper 3D perspective on elements.
*/
define(['Modernizr', 'createElement', 'docElement'], function(Modernizr, createElement, docElement) {
  Modernizr.addTest('preserve3d', function() {
    var outerDiv = createElement('div');
    var innerDiv = createElement('div');

    outerDiv.style.cssText = 'transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);';
    innerDiv.style.cssText = 'width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);';

    outerDiv.appendChild(innerDiv);
    docElement.appendChild(outerDiv);

    var result = innerDiv.getBoundingClientRect();
    docElement.removeChild(outerDiv);

    return result.width && result.width < 4;
  });
});
