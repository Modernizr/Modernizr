define(['Modernizr', 'createElement', 'testStyles'], function( Modernizr, createElement, testStyles ) {
  /**
   * checked pseudo selector
   */
  Modernizr.addTest('checked', function(){
   return Modernizr.testStyles('#modernizr input {width:100px} #modernizr :checked {width:200px;display:block}', function(elem, rule){
      var cb = document.createElement('input');
      cb.setAttribute("type", "checkbox");
      cb.setAttribute("checked", "checked");
      elem.appendChild(cb);
      return cb.offsetWidth == 200;
    });
  });
});
