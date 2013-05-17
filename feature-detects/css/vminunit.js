/*!
{
  "name": "CSS vmin unit",
  "property": "cssvminunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "http://jsfiddle.net/glsee/JRmdq/8/"
  }]
}
!*/
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  testStyles('#modernizr { width: 50vmin; }', function( elem, rule ) {
    var one_vw = window.innerWidth/100;
    var one_vh = window.innerHeight/100;
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle)['width'],10);
    Modernizr.addTest('cssvminunit', parseInt(Math.min(one_vw, one_vh)*50,10) == compWidth );
  });
});
