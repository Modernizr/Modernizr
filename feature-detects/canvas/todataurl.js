/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "builderAliases": ["canvas_todataurl_type"],
  "async" : false,
  "notes": [{
    "name": "MDN article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL"
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
