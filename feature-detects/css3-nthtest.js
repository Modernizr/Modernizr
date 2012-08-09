/* css3-nthtest.js */
/* Additional tests for CSS 3 Pseudo class nth tests */
/* http://www.dlbsolutions.ca */

//nth-child
Modernizr.testStyles('#modernizr div:nth-child(3) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthchild', function() {
        
        var nthVal = 3;
        
        for(var i=0;i<=elem.getElementsByTagName('div').length-1;i++) {

              if ((i+1) == nthVal) { //nth child to test
                   if (elem.getElementsByTagName('div')[i].offsetHeight != 20) {
                     return false;
                   }
              } 
        }
        
        return true;
    });
  }, 6);


//:nth-of-type
Modernizr.testStyles('#modernizr p:nth-of-type(odd) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthoftype', function() {
        
         for (var i=1;i<=3;i++) {
            elem.appendChild(document.createElement("p"));
        }
        
        for (var i=0;i<=elem.getElementsByTagName('p').length-1;i++) {
              if (((i+1)%2 == 1) || (i == 0)) { //odd
                   if (elem.getElementsByTagName('p')[i].offsetHeight != 20) {
                    return false;
                   }
              }
        }
        
        return true;
    });
  }, 3);
