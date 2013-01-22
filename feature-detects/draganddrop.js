define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // http://dev.w3.org/html5/spec/dnd.html

  Modernizr.addTest('draganddrop', function() {
    var div = createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
  });
});
