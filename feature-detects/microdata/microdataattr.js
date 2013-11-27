/*!
{
  "name": "Microdata Attribute",
  "property": "microdataattribute",
  "tags": ["microdata"]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement)
{
  var span = createElement('span');

  Modernizr.addTest('microdataitemtype', function(){
    try{
      span.itemtype = "http://schema.org/Person";
      return !!document.getItems('http://schema.org/Person') === true;
    }
    catch(e){
      return false;
    }
  });

  Modernizr.addTest('microdataitemprop', function(){
    try{
      span.itemprop = "test";
      return !!document.getItems('test') === true;
    }
    catch(e){
      return false;
    }
  });
});
