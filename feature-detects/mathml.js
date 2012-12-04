define(['Modernizr', 'createElement', 'addTest'], function( Modernizr, createElement, addTest ) {
  // MathML
  // http://www.w3.org/Math/
  // By Addy Osmani
  // Based on work by Davide (@dpvc) and David (@davidcarlisle)
  // in https://github.com/mathjax/MathJax/issues/182

  Modernizr.addAsyncTest('mathml', function() {
    var waitTime = 300;
    setTimeout(runMathMLTest, waitTime);
    // Hack to make sure that the body exists
    // TODO:: find a more reasonable method of
    // doing this.
    function runMathMLTest() {
      if (!document.body && !document.getElementsByTagName('body')[0]) {
        setTimeout(runMathMLTest, waitTime);
        return;
      }
      addTest(function () {
        var hasMathML = false;
        if ( document.createElementNS ) {
          var ns = "http://www.w3.org/1998/Math/MathML";
          var div = createElement("div");

          div.style.position = "absolute";

          var mfrac = div.appendChild(document.createElementNS(ns,"math"))
                         .appendChild(document.createElementNS(ns,"mfrac"));

          mfrac.appendChild(document.createElementNS(ns,"mi"))
               .appendChild(document.createTextNode("xx"));

          mfrac.appendChild(document.createElementNS(ns,"mi"))
               .appendChild(document.createTextNode("yy"));

          document.body.appendChild(div);

          hasMathML = div.offsetHeight > div.offsetWidth;

          // Clean up the element
          document.body.removeChild(div);
        }
        return hasMathML;
      });
    }
  });
});
