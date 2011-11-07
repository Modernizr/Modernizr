
// developer.mozilla.org/en/CSS/background-size

Modernizr.testStyles(' #modernizr { background-size: cover; } ', function(elem, rule){ 

  var bool = (window.getComputedStyle ?
              getComputedStyle(elem, null) :
              elem.currentStyle)['background-size'] == 'cover';
            
  Modernizr.addTest('bgsizecover', bool);
});