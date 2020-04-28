/*!
{
  "name": "CSS :focus-within pseudo-selector",
  "caniuse": "css-focus-visible",
  "property": "focuswithin",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('focuswithin', function() {
  try {
    document.querySelector(':focus-within');
  } catch (error) {
    return false;
  }
  return true;
});

export default Modernizr.focuswithin
