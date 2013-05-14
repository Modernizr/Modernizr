/*!
{
  "name": "CSS vmax unit",
  "property": "cssvmaxunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "http://jsfiddle.net/glsee/JDsWQ/4/"
  }]
}
!*/
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  testStyles('#modernizr { width: 50vmax; }', function( elem, rule ) {
    var one_vw = window.innerWidth/100;
    var one_vh = window.innerHeight/100;
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle)['width'],10);
    Modernizr.addTest('cssvmaxunit', parseInt(Math.max(one_vw, one_vh)*50,10) == compWidth );
  });
});
