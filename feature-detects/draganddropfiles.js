/*!
{
  "name": "Drag & Drop",
  "property": "draganddropfiles",
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/TR/2010/WD-html5-20101019/dnd.html"
  }]
}
!*/
/* DOC

Detects support for native drag & drop file upload.

*/
define(['Modernizr', 'test/draganddrop'], function( Modernizr ) {
  Modernizr.addTest('draganddropfiles', function() {
   return (Modernizr.draganddrop && 'FileList' in window);
  });
});
