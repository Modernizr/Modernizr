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
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('keygen', function(){
    var div = document.createElement('div');
    div.innerHTML = '<keygen />';
    var keygen = div.childNodes[0];
    //Most browsers:
    if(keygen.type === 'keygen') return true;
    //Firefox:
    return !!keygen.attributes['_moz-type'] && keygen.attributes['_moz-type'].value === '-mozilla-keygen';
  });
});

