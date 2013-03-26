/*!
{
  "name": "CSS :checked pseudo-selector",
  "caniuse": "css-sel3",
  "property": "checked",
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/pull/879"
  }]
}
!*/
define(['Modernizr', 'createElement', 'testStyles'], function( Modernizr, createElement, testStyles ) {
  Modernizr.addTest('checked', function(){
   return testStyles('#modernizr input {width:100px} #modernizr :checked {width:200px;display:block}', function(elem, rule){
      var cb = createElement('input');
      cb.setAttribute("type", "checkbox");
      cb.setAttribute("checked", "checked");
      elem.appendChild(cb);
      return cb.offsetWidth == 200;
    });
  });
});
