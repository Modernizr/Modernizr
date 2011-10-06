



// developer.mozilla.org/en/CSS/background-repeat

// test page: jsbin.com/uzesun/

(function(){


function getBgRepeatValue(elem){
    return (window.getComputedStyle ?
             getComputedStyle(elem, null).getPropertyValue('background-repeat') :
             elem.currentStyle['background-repeat']);
}
  

Modernizr.testStyles(' #modernizr { background-repeat: round; } ', function(elem, rule){ 

  Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');

});



Modernizr.testStyles(' #modernizr { background-repeat: space; } ', function(elem, rule){ 

  Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');

});


})();
