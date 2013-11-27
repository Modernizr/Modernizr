/*!
{
  "name": "Microdata Attribute",
  "property": "microdataAttribute",
  "tags": ["microdata", "microdata"]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('microdataAttr', function() {
      var span = createElement('span');
      return (!!span.itemProp || !!span.itemtype || !!span.itemscope || !!span.itemid || !!span.itemref) === false 
    });
});
