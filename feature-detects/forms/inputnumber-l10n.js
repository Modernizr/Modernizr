define(['Modernizr', 'createElement', 'docElement', 'getBody'], function( Modernizr, createElement, docElement, getBody ) {
  // input[type="number"] localized input/output
  // // Detects whether input type="number" is capable of receiving and
  // // displaying localized numbers, e.g. with comma separator
  // // https://bugs.webkit.org/show_bug.cgi?id=42484
  // // Based on http://trac.webkit.org/browser/trunk/LayoutTests/fast/forms/script-tests/input-number-keyoperation.js?rev=80096#L9
  // // By Peter Janes

  Modernizr.addTest('localizednumber', function() {
    var el = createElement('div');
    var diff;
    var body = getBody();

    var root = (function() {
      return docElement.insertBefore(body, docElement.firstElementChild || docElement.firstChild);
    }());
    el.innerHTML = '<input type="number" value="1.0" step="0.1"/>';
    var input = el.childNodes[0];
    root.appendChild(el);
    input.focus();
    try {
      document.execCommand('InsertText', false, '1,1');
    } catch(e) { // prevent warnings in IE
    }
    diff = input.type === 'number' && input.valueAsNumber === 1.1 && input.checkValidity();
    root.removeChild(el);
    body.fake && root.parentNode.removeChild(root);
    return diff;
  });

});
