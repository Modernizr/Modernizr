/*!
{
  "name": "keygen",
  "property": "keygen",
  "authors": ["Micole"],
  "notes": [{
    "name": "Github Issue W/example",
    "href": "https://github.com/Modernizr/Modernizr/issues/212#issuecomment-839230"
  }]
  
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('keygen', function(){
    var x = createElement('keygen');
    return x.nodeName == 'KEYGEN';
  });
});