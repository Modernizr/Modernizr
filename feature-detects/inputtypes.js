/*!
{
  "name": "Form input types",
  "property": "inputtypes",
  "caniuse": "forms",
  "tags": ["forms"],
  "authors": ["Mike Taylor"],
  "polyfills": [
    "jquerytools",
    "webshims",
    "h5f",
    "webforms2",
    "nwxforms",
    "fdslider",
    "html5slider",
    "galleryhtml5forms",
    "jscolor",
    "html5formshim",
    "selectedoptionsjs",
    "formvalidationjs"
  ]
}
!*/
/* DOC
Detects support for HTML5 form input types and exposes Boolean subproperties with the results:

```javascript
Modernizr.inputtypes.color
Modernizr.inputtypes.date
Modernizr.inputtypes.datetime
Modernizr.inputtypes['datetime-local']
Modernizr.inputtypes.email
Modernizr.inputtypes.month
Modernizr.inputtypes.number
Modernizr.inputtypes.range
Modernizr.inputtypes.search
Modernizr.inputtypes.tel
Modernizr.inputtypes.time
Modernizr.inputtypes.url
Modernizr.inputtypes.week
```
*/
import Modernizr from '../src/Modernizr.js';
import inputElem from '../src/inputElem.js';
import docElement from '../src/docElement.js';
import isBrowser from '../src/isBrowser.js';
var result = {};

// Run through HTML5's new input types to see if the UA understands any.
//   This is put behind the tests runloop because it doesn't return a
//   true/false like all the other tests; instead, it returns an object
//   containing each input type with its corresponding true/false value

// Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
(function() {
  var props = 'search tel url email datetime date month week time datetime-local number range color'.split(' ');
  var smile = '1)';
  var inputElemType;
  var defaultView;
  var bool;

  if (isBrowser) {
    // all of these detects exist as a sub-object to Modernizr.inputtypes. In order for that to work,
    // Modernizr.inputtypes has to exist before we attempt to hand new props off of it. Since "input type"
    // is more of less useless (any browser that can run javascript will has inputs with the type attr), we
    // just skip a test and directly assign it to a POJO
    Modernizr.inputtypes = {};

    for (var i = 0; i < props.length; i++) {
      inputElem.setAttribute('type', inputElemType = props[i]);
      bool = inputElem.type !== 'text' && 'style' in inputElem;

      // We first check to see if the type we give it sticks..
      // If the type does, we feed it a textual value, which shouldn't be valid.
      // If the value doesn't stick, we know there's input sanitization which infers a custom UI
      if (bool) {

        inputElem.value = smile;
        inputElem.style.cssText = 'position:absolute;visibility:hidden;';

        if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

          docElement.appendChild(inputElem);
          defaultView = document.defaultView;

          // Safari 2-4 allows the smiley as a value, despite making a slider
          bool = defaultView.getComputedStyle &&
            defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
            // Mobile android web browser has false positive, so must
            // check the height to see if the widget is actually there.
            (inputElem.offsetHeight !== 0);

          docElement.removeChild(inputElem);

        } else if (/^(search|tel)$/.test(inputElemType)) {
          // Spec doesn't define any special parsing or detectable UI
          //   behaviors so we pass these through as true

          // Interestingly, opera fails the earlier test, so it doesn't
          //  even make it here.

        } else if (/^(url|email)$/.test(inputElemType)) {
          // Real url and email support comes with prebaked validation.
          bool = inputElem.checkValidity && inputElem.checkValidity() === false;

        } else {
          // If the upgraded input component rejects the :) text, we got a winner
          bool = inputElem.value !== smile;
        }
      }

      result[inputElemType] = !!bool
      Modernizr.addTest('inputtypes.' + inputElemType, !!bool);
    }
  }
})();

export default result
