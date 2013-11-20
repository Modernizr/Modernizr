/*!
{
  "name": "keygen",
  "property": "keygen",
  "authors": ["Micole"]
  
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('keygen', function(){
    var div = document.createElement('div');
    div.innerHTML = '<keygen />';
    var keygen = div.childNodes[0];
    return keygen.type === 'keygen' || "_moz-type" in keygen.attributes;
  });
});

