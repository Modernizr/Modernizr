/*!
{
  "name": "AVIF",
  "async": true,
  "property": "avif",
  "caniuse": "avif",
  "tags": ["image"],
  "authors": ["Markel Ferro (@MarkelFe)"],
  "polyfills": ["avifjs"],
  "notes": [{
    "name": "Avif Spec",
    "href": "https://aomediacodec.github.io/av1-avif/"
  }]
}
!*/
/* DOC
Test for AVIF support
*/
define(['Modernizr', 'addTest'], function(Modernizr, addTest) {

    Modernizr.addAsyncTest(function() {
      var image = new Image();
  
      image.onload = image.onerror = function() {
        addTest('avif', image.width === 1);
      };
  
      image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAEcbWV0YQAAAAAAAABIaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGNhdmlmIC0gaHR0cHM6Ly9naXRodWIuY29tL2xpbmstdS9jYXZpZgAAAAAeaWxvYwAAAAAEQAABAAEAAAAAAUQAAQAAABcAAAAqaWluZgEAAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFJbWFnZQAAAAAOcGl0bQAAAAAAAQAAAHJpcHJwAAAAUmlwY28AAAAQcGFzcAAAAAEAAAABAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAAFmF2MUOBAAwACggYAAYICGgIIAAAABhpcG1hAAAAAAAAAAEAAQUBAoMDhAAAAB9tZGF0CggYAAYICGgIIBoFHiAAAEQiBACwDoA=';
    });
  });