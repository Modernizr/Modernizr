/*!
{
  "name": "input[type=\"number\"] Localization",
  "property": "localizednumber",
  "tags": ["forms", "localization", "attribute"],
  "authors": ["Peter Janes"],
  "notes": [{
    "name": "Webkit Bug Tracker Listing",
    "href": "https://bugs.webkit.org/show_bug.cgi?id=42484"
  }, {
    "name": "Based on This",
    "href": "https://trac.webkit.org/browser/trunk/LayoutTests/fast/forms/script-tests/input-number-keyoperation.js?rev=80096#L9"
  }],
  "knownBugs": ["Only ever returns true if the browser/OS is configured to use comma as a decimal separator. This is probably fine for most use cases."]
}
!*/
/* DOC
Detects whether input type="number" is capable of receiving and displaying localized numbers, e.g. with comma separator.
*/
define(['Modernizr', 'createElement', 'getBody', 'test/inputtypes', 'test/forms/validation'], function(Modernizr, createElement, getBody) {
  Modernizr.addTest('localizednumber', function() {
    /* this extends our testing of input[type=number], so bomb out if that's missing */
    if (!Modernizr.inputtypes.number) { return false; }
    /* we rely on checkValidity later, so bomb out early if we don't have it */
    if (!Modernizr.formvalidation) { return false; }

    var body = getBody();
    var div = createElement('div');
    var firstChild = body.firstElementChild || body.firstChild;
    var result;

    body.insertBefore(div, firstChild);

    div.innerHTML = '<input type="number" value="1.0" step="0.1" style="position: fixed; top: 0;" />';
    var input = div.childNodes[0];
    body.appendChild(div);

    input.focus();
    try {
      document.execCommand('SelectAll', false); // Overwrite current input value, rather than appending text
      document.execCommand('InsertText', false, '1,1');
    } catch (e) {} // prevent warnings in IE

    /* results */
    result = input.type === 'number' && input.valueAsNumber === 1.1 && input.checkValidity();

    /* cleanup */
    body.removeChild(div);
    if (body.fake) {
      body.parentNode.removeChild(body);
    }

    return result;
  });

});
