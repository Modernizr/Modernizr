/*!
{
  "name": "keygen",
  "property": "keygen",
  "authors": ["Micole"]
  
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('keygen', function(){
    /*var form = createElement('form');
    form.addEventListener('submit', function(e) {
      if(!window.opera){
        e.preventDefault();
      }
      e.stopPropagation();
    }, false);

    form.innerHTML = '<keygen /><button></button>';*/


    /*var div = document.createElement('div');
    div.innerHTML = '<keygen />';
    var keygen = div.childNodes[0];
    ///return keygen.isSupported();
    //var keygen2 = keygen.cloneNode();
    //return keygen2.type === 'keygen' || "_moz-type" in keygen2.attributes;*/

    var keygen = document.createElement('keygen');
    return document.window.keygen.keytype === "";
  });
});

