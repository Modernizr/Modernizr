



// developer.mozilla.org/en/CSS/background-repeat

// test page: jsbin.com/uzesun/



Modernizr.testStyles(' #modernizr { background-repeat: round; } ', function(elem, rule){ 

  var bool = (window.getComputedStyle ?
              getComputedStyle(elem, null) :
              elem.currentStyle)['background-repeat'] == 'round';
            
  Modernizr.addTest('bgrepeatround', bool);
});



Modernizr.testStyles(' #modernizr { background-repeat: space; } ', function(elem, rule){ 

  var bool = (window.getComputedStyle ?
              getComputedStyle(elem, null) :
              elem.currentStyle)['background-repeat'] == 'space';
            
  Modernizr.addTest('bgrepeatspace', bool);
});


