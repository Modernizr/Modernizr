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
/* DOC
Detects support for the `:checked` pseudo-delector, which matches a radio button, checkbox or select option which is currently in an `on` state.
*/
define(['Modernizr', 'createElement', 'testStyles'], function( Modernizr, createElement, testStyles ) {
  Modernizr.addTest('checked', function(){
    return testStyles('#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}', function( elem ){
      var cb = createElement('input');
      cb.setAttribute('type', 'checkbox');
      cb.setAttribute('checked', 'checked');
      elem.appendChild(cb);
      return cb.offsetLeft === 20;
    });
  });
});
