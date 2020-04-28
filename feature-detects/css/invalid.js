/*!
{
  "name": "CSS :invalid pseudo-class",
  "property": "cssinvalid",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/:invalid"
  }]
}
!*/
/* DOC
  Detects support for the ':invalid' CSS pseudo-class.
*/
import Modernizr from '../../src/Modernizr.js';
import testStyles from '../../src/testStyles.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('cssinvalid', function() {
  return testStyles('#modernizr input{height:0;border:0;padding:0;margin:0;width:10px} #modernizr input:invalid{width:50px}', function(elem) {
    var input = createElement('input');
    input.required = true;
    elem.appendChild(input);
    return input.clientWidth > 10;
  });
});

export default Modernizr.cssinvalid
