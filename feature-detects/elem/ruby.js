/*!
{
  "name": "ruby, rp, rt Elements",
  "caniuse": "ruby",
  "property": "ruby",
  "tags": ["elem"],
  "builderAliases": ["elem_ruby"],
  "authors": ["Cătălin Mariș"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import docElement from '../../src/docElement.js';
import computedStyle from '../../src/computedStyle.js';

Modernizr.addTest('ruby', function() {

  var ruby = createElement('ruby');
  var rt = createElement('rt');
  var rp = createElement('rp');
  var displayStyleProperty = 'display';
  // 'fontSize' - because it`s only used for IE6 and IE7
  var fontSizeStyleProperty = 'fontSize';

  ruby.appendChild(rp);
  ruby.appendChild(rt);
  docElement.appendChild(ruby);

  // browsers that support <ruby> hide the <rp> via "display:none"
  if (computedStyle(rp, null, displayStyleProperty) === 'none' ||                                                          // for non-IE browsers
       // but in IE browsers <rp> has "display:inline" so, the test needs other conditions:
       computedStyle(ruby, null, displayStyleProperty) === 'ruby' && computedStyle(rt, null, displayStyleProperty) === 'ruby-text' || // for IE8+
       computedStyle(rp, null, fontSizeStyleProperty) === '6pt' && computedStyle(rt, null, fontSizeStyleProperty) === '6pt') {        // for IE6 & IE7

    cleanUp();
    return true;

  } else {
    cleanUp();
    return false;
  }

  function cleanUp() {
    docElement.removeChild(ruby);
  }

});

export default Modernizr.ruby
