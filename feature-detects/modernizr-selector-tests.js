/* modernizr-selector-tests.js */
/* Additional tests for CSS 3 selectors */
/* http://www.dlbsolutions.ca */

//last-child
Modernizr.testStyles('#modernizr div:last-child {height:20px;}', function(elem, rule){
    Modernizr.addTest('lastchild', function() {
        return elem.getElementsByTagName('div')[2].offsetHeight == 20
    });
  }, 3);


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


// all CSS3 attribute selectors
// div[id^="test"], div[id*="this"], div[id$="end"] 
Modernizr.testStyles('#modernizr div[id^="beginswith"], #modernizr div[id*="contains"], #modernizr div[id$="end"]  {height:20px;}', function(elem, rule){
    
    Modernizr.addTest('css3attrselector', function() {
        
        //div[id^="beginswith"] - add an element with attribute value
        var new_div1 = document.createElement("div");
        new_div1.setAttribute("id","beginswithtest");
        elem.appendChild(new_div1);
        
        //div[id*="contains"] - add an element with attribute value        
        var new_div2 = document.createElement("div");
        new_div2.setAttribute("id","testingcontainsstr");
        elem.appendChild(new_div2);
        
        //div[id$="end"] - add an element with attribute value        
        var new_div3 = document.createElement("div");
        new_div3.setAttribute("id","testingend");
        elem.appendChild(new_div3);       
        
        // Test all three selector attributes are supported
        var elemList = elem.getElementsByTagName('div');
        
        for (var i=0; i<= elemList.length - 1; i++) {
            if (elemList[i].offsetHeight != 20) { return false; }
        }
        
        return true
    });
  });