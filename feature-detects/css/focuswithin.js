/*!
{
  "name": "CSS :focus-within pseudo-selector",
  "caniuse": "css-focus-visible",
  "property": "focuswithin",
  "tags": ["css"]
}
!*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('focuswithin', function() {
    try {
      document.querySelector(':focus-within')
    } catch (error) {
      return false;
    }
    return true;
  });
});
