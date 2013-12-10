/*!
{
  "name": "MathML",
  "property": "mathml",
  "caniuse": "mathml",
  "authors": ["Addy Osmani", "Davide P. Cervone", "David Carlisle"],
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/Math/"
  }],
  "polyfills": ["mathjax"]
}
!*/
/* DOC

Detects support for MathML, for mathematic equations in web pages.

*/
define(['Modernizr'], function( Modernizr ) {
  // Based on work by Davide (@dpvc) and David (@davidcarlisle)
  // in https://github.com/mathjax/MathJax/issues/182

  Modernizr.addTest('mathml', function() {
    var ret;

    Modernizr.testStyles('#modernizr{position:absolute}', function(node){
      node.innerHTML = '<math><mfrac><mi>xx</mi><mi>yy</mi></mfrac></math>';

      ret = node.offsetHeight > node.offsetWidth;
    });

    return ret;
  });
});
