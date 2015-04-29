/*!
{
  "name": "CSS vmin unit",
  "property": "cssvminunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vminunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "http://jsfiddle.net/glsee/JRmdq/8/"
  }]
}
!*/
define(['Modernizr', 'docElement', 'testStyles', 'roundedEquals'], function( Modernizr, docElement, testStyles, roundedEquals ) {
  testStyles('#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}', function() {
    var elem = document.getElementById('modernizr1');
    var scroller = document.getElementById('modernizr2');
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = docElement.clientWidth/100;
    var one_vh = docElement.clientHeight/100;
    var expectedWidth = parseInt(Math.min(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle)['width'],10);

    Modernizr.addTest('cssvminunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 2);
});
