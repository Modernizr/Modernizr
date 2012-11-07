define(['Modernizr', 'createElement', 'docElement'], function( Modernizr, createElement, docElement ) {
  // input[type="number"] localized input/output
  // // Detects whether input type="number" is capable of receiving and
  // // displaying localized numbers, e.g. with comma separator
  // // https://bugs.webkit.org/show_bug.cgi?id=42484
  // // Based on http://trac.webkit.org/browser/trunk/LayoutTests/fast/forms/script-tests/input-number-keyoperation.js?rev=80096#L9
  // // By Peter Janes

  Modernizr.addTest('localizedNumber', function() {
    var el = createElement('div');
    var fake;

    var root = document.body || (function() {
      fake = true;
      return docElement.insertBefore(createElement('body'), docElement.firstElementChild || docElement.firstChild);
    }());
    el.innerHTML = '<input type="number" value="1.0" step="0.1"/>';
    var input = el.childNodes[0];
    root.appendChild(el);
    input.focus();
    try {
      document.execCommand('InsertText', false, '1,1');
    } catch(e) { // prevent warnings in IE
    }
    var diff = input.type === 'number' && input.valueAsNumber === 1.1 && input.checkValidity();
    root.removeChild(el);
    fake && root.parentNode.removeChild(root);
    return diff;
  });

});
