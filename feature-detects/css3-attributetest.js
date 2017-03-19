/* css3-attributetest.js */
/* Additional tests for CSS 3 attribute selectors */
/* http://www.dlbsolutions.ca */


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