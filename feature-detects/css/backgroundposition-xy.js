/*!
{
  "name": "Background Position XY",
  "property": "bgpositionxy",
  "tags": ["css"],
  "authors": ["Allan Lei", "Brandom Aaron"],
  "notes": [{
    "name": "Demo",
    "href": "http://jsfiddle.net/allanlei/R8AYS/"
  }, {
    "name": "Adapted From",
    "href": "https://github.com/brandonaaron/jquery-cssHooks/blob/master/bgpos.js"
  }]
}
!*/
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  Modernizr.addTest('bgpositionxy', function() {
    return testStyles('#modernizr {background-position: 3px 5px;}', function( elem ) {
      var cssStyleDeclaration = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
      var xSupport = (cssStyleDeclaration.backgroundPositionX == '3px') || (cssStyleDeclaration['background-position-x'] == '3px');
      var ySupport = (cssStyleDeclaration.backgroundPositionY == '5px') || (cssStyleDeclaration['background-position-y'] == '5px');
      return xSupport && ySupport;
    });
  });
});
