/*!
{
  "name": "CSS vmax unit",
  "property": "cssvmaxunit",
  "caniuse": "viewport-units",
  "tags": ["css"],
  "builderAliases": ["css_vmaxunit"],
  "notes": [{
    "name": "Related Modernizr Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/572"
  },{
    "name": "JSFiddle Example",
    "href": "http://jsfiddle.net/glsee/JDsWQ/4/"
  }]
}
!*/
define(['Modernizr', 'docElement', 'testStyles', 'roundedEquals'], function(Modernizr, docElement, testStyles, roundedEquals) {
  testStyles('#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}', function(node) {
    var elem = node.childNodes[1];
    var scroller = node.childNodes[0];
    var scrollbarWidth = parseInt((scroller.offsetWidth - scroller.clientWidth) / 2, 10);

    var one_vw = docElement.clientWidth / 100;
    var one_vh = docElement.clientHeight / 100;
    var expectedWidth = parseInt(Math.max(one_vw, one_vh) * 50, 10);
    var compWidth = parseInt((window.getComputedStyle ?
                          getComputedStyle(elem, null) :
                          elem.currentStyle)['width'], 10);

    Modernizr.addTest('cssvmaxunit', roundedEquals(expectedWidth, compWidth) || roundedEquals(expectedWidth, compWidth - scrollbarWidth));
  }, 2);
});
