define(['Modernizr', 'createElement', 'docElement', 'getStyle'], function( Modernizr, createElement, docElement, getStyle ) {
  // Browser support test for the HTML5 <ruby>, <rt> and <rp> elements
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-ruby-element
  //
  // by @alrra

  Modernizr.addTest('ruby', function () {

    var ruby = createElement('ruby');
    var rt = createElement('rt');
    var rp = createElement('rp');
    var displayStyleProperty = 'display';
    var fontSizeStyleProperty = 'fontSize'; // 'fontSize' - because it`s only used for IE6 and IE7

    ruby.appendChild(rp);
    ruby.appendChild(rt);
    docElement.appendChild(ruby);

    // browsers that support <ruby> hide the <rp> via "display:none"
    if ( getStyle(rp).getPropertyValue(displayStyleProperty) == 'none' ||                                                       // for non-IE browsers
        // but in IE browsers <rp> has "display:inline" so, the test needs other conditions:
        getStyle(ruby).getPropertyValue(displayStyleProperty) == 'ruby' && getStyle(rt).getPropertyValue(displayStyleProperty) == 'ruby-text' || // for IE8 & IE9
          getStyle(rp).getPropertyValue(fontSizeStyleProperty) == '6pt' && getStyle(rt).getPropertyValue(fontSizeStyleProperty) == '6pt' ) {       // for IE6 & IE7

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
