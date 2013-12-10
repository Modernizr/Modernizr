/*!
{
  "name": "CSS vw unit",
  "property": "cssvwunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "http://jsfiddle.net/FWeinb/etnYC/"
  }]
}
!*/
define(['Modernizr', 'docElement', 'testStyles'], function( Modernizr, docElement, testStyles ) {
  testStyles('#modernizr { width: 50vw; }', function( elem ) {
    var width = parseInt(docElement.innerWidth/2,10);
    var compStyle = parseInt((window.getComputedStyle ?
                              getComputedStyle(elem, null) :
                              elem.currentStyle)['width'],10);

    Modernizr.addTest('cssvwunit', compStyle == width);
  });
});
