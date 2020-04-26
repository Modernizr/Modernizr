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
define(['Modernizr', 'createElement', 'docElement', 'computedStyle'], function(Modernizr, createElement, docElement, computedStyle) {
  Modernizr.addTest('ruby', function() {

    var ruby = createElement('ruby');
    var rt = createElement('rt');
    var rp = createElement('rp');

    ruby.appendChild(rp);
    ruby.appendChild(rt);
    docElement.appendChild(ruby);

    // browsers that support <ruby> hide the <rp> via "display:none"
    if (computedStyle(rp, null, 'display') === 'none' ||                                                       // for non-IE browsers
         // but in IE browsers <rp> has "display:inline" so, the test needs other conditions:
      computedStyle(ruby, null, 'display') === 'ruby' && computedStyle(rt, null, 'display') === 'ruby-text' || // for IE8+
      computedStyle(rp, null, 'fontSize') === '6pt' && computedStyle(rt, null, 'fontSize') === '6pt') {        // for IE6 & IE7

      cleanUp();
      return true;

    } else {
      cleanUp();
      return false;
    }

    function cleanUp() {
      docElement.removeChild(ruby);
      // the removed child node still exists in memory, so ...
      ruby = null;
      rt = null;
      rp = null;
    }
  });
});
