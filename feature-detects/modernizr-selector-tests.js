/* modernizr-selector-tests.js */
/* Additional tests for CSS 3 selectors */
/* http://www.dlbsolutions.ca */

//last-child
Modernizr.testStyles('#modernizr div:last-child {height:20px;}', function(elem, rule){
    Modernizr.addTest('lastchild', function() {
        return elem.getElementsByTagName('div')[2].offsetHeight == 20
    });
  }, 3);


//nth-child(odd)
Modernizr.testStyles('#modernizr div:nth-child(odd) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthchildodd', function() {
        
        for(var i=0;i<=elem.getElementsByTagName('div').length-1;i++) {

              if (((i+1)%2 == 1) || (i == 0)) { //odd
                   if (elem.getElementsByTagName('div')[i].offsetHeight != 20) {
                     return false;
                   }
              }
        }
        
        return true;
    });
  }, 6);


//nth-child(even)
Modernizr.testStyles('#modernizr div:nth-child(even) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthchildeven', function() {
        
        for(var i=0;i<=elem.getElementsByTagName('div').length-1;i++) {

              if (((i+1)%2 == 0) && (i != 0)) { //even
                   if (elem.getElementsByTagName('div')[i].offsetHeight != 20) {
                     return false;
                   }
              } 
        }
        
        return true;
    });
  }, 6);


//nth-child(n) - n=1 ....n=total
Modernizr.testStyles('#modernizr div:nth-child(3) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthchildn', function() {
        
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


//:nth-of-type(n)
//nth-of-type(odd)
Modernizr.testStyles('#modernizr p:nth-of-type(odd) {height:20px;}', function(elem, rule){
    Modernizr.addTest('nthoftypeodd', function() {
        
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



// attribute selectors
// [att^=val] – the “begins with” selector
Modernizr.testStyles('#modernizr div[id^="test"] {height:20px;}', function(elem, rule){
    
    Modernizr.addTest('attrbegins', function() {
        
        //add an element with attribute value
        var new_div = document.createElement("div");
        new_div.setAttribute("id","testthisout");
        elem.appendChild(new_div);
         
        if (elem.lastChild.offsetHeight == 20) {
            return true;
        }
        
        return false;
    });
  });


// [att$=val] – the “ends with” selector
Modernizr.testStyles('#modernizr div[id$="out"] {height:20px;}', function(elem, rule){
    
    Modernizr.addTest('attrends', function() {
        
        //add an element with attribute value
        var new_div = document.createElement("div");
        new_div.setAttribute("id","testthisout");
        elem.appendChild(new_div);
         
        if (elem.lastChild.offsetHeight == 20) {
            return true;
        }
        
        return false;
    });
  });



// [att*=val] – the “contains” selector
Modernizr.testStyles('#modernizr div[id*="this"] {height:20px;}', function(elem, rule){
    
    Modernizr.addTest('attrcontains', function() {
        
        //add an element with attribute value
        var new_div = document.createElement("div");
        new_div.setAttribute("id","testthisout");
        elem.appendChild(new_div);
         
        if (elem.lastChild.offsetHeight == 20) {
            return true;
        }
        
        return false;
    });
  });








