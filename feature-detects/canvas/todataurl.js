/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl"
  }]
}
!*/
define(['Modernizr', 'createElement', 'test/canvas'], function( Modernizr, createElement ) {

    var canvas = createElement('canvas'),
        type = ["jpeg", "png", "webp"],
        i = 0;
    
    // Speeds up the code http://jsperf.com/test-todataurl-speed
    canvas.width = canvas.height = 1;
    
    for(;i<3;i++){
        Modernizr.addTest('todataurl' + type[i], !!Modernizr.canvas && canvas.toDataURL('image/' + type[i]).indexOf('data:image/' + type[i]) === 0)
    }

});
