/*!
{
  "name": "CSS :nth-child pseudo-selector",
  "caniuse": "css-sel3",
  "property": "nth-child",
  "tags": ["css"],
  "notes": [
    {
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/pull/685"
    },
    {
      "name": "Sitepoint :nth-child documentation",
      "href": "http://reference.sitepoint.com/css/pseudoclass-nthchild"
    }
  ],
  "authors": "@emilchristensen",
  "warnings": "Known false negative in Safari 3.1 and Safari 3.2.2"
}
!*/
define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  testStyles('#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}', function( elem ) {
    Modernizr.addTest('nthchild', function () {
      var elems = elem.getElementsByTagName('div'),
      test = true;

      for (var i = 0; i < 5; i++) {
        test = test && elems[i].offsetWidth === i % 2 + 1;
      }
      
      return test;
    });
  }, 5);
});
