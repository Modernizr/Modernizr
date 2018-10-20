/*!
{
  "name": "CSS general sibling selector",
  "property": "siblinggeneral",
  "caniuse": "css-sel3",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/889"
  }]
}
!*/
define(['Modernizr', 'createElement', 'testStyles'], function(Modernizr, createElement, testStyles) {
  Modernizr.addTest('siblinggeneral', function() {
    return testStyles('#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}', function(elem) {
      return elem.childNodes[1].offsetWidth === 200;
    }, 2);
  });
});
