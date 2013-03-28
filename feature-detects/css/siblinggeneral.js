/*!
{
  "name": "CSS general sibling selector",
  "caniuse": "css-sel3",
  "property": "siblinggeneral",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'createElement', 'testStyles'], function( Modernizr, createElement, testStyles ) {
  Modernizr.addTest('siblinggeneral', function(){
   return testStyles('#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}', function(elem, rule){
      return elem.lastChild.offsetWidth == 200;
    }, 2);
  });
});
