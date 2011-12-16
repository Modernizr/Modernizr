
// MathML omg!
// http://www.w3.org/Math/

// this tests MathML in HTML, not MathML as XML.
// test by Niels Leenheer

// demo: 
// http://www1.chapman.edu/~jipsen/mathml/mathhtmltest.htm

Modernizr.addTest('mathml', function(){

  var e = document.createElement('div');
      e.innerHTML = '<math></math>';
      
  var bool = e.firstChild 
  && "namespaceURI" in e.firstChild 
  && e.firstChild.namespaceURI == 'http://www.w3.org/1998/Math/MathML';

  return bool;  

});
