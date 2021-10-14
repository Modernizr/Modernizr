/*!
{
  "name": "CSS :focus-visible pseudo-selector",
  "caniuse": "css-focus-visible",
  "property": "focusvisible",  
  "authors": ["@esaborit4code"],
  "tags": ["css"]
}
!*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('focusvisible', function() {
    try {
      document.querySelector(':focus-visible');
    } catch (error) {
      return false;
    }
    return true;
  });
});
