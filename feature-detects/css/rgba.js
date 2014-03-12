/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "http://css-tricks.com/rgba-browser-support/"
  }]
}
!*/
define(['Modernizr', 'setCss', 'createElement'], function( Modernizr, setCss, createElement ) {
  Modernizr.addTest('rgba', function() {
    var elem = createElement('div');
    setCss(elem, 'background-color:rgba(150,255,150,.5)');

    return ('' + elem.style.backgroundColor).indexOf('rgba') > -1;
  });
});
