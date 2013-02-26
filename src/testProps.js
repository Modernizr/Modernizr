define(['contains', 'mStyle', 'createElement', 'nativeTestProps', 'is'], function( contains, mStyle, createElement, nativeTestProps, is ) {
  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Because the testing of the CSS property names (with "-", as
  // opposed to the camelCase DOM properties) is non-portable and
  // non-standard but works in WebKit and IE (but not Gecko or Opera),
  // we explicitly reject properties with dashes so that authors
  // developing in WebKit or IE first don't end up with
  // browser-specific content by accident.

  function testProps( props, prefixed, values ) {

    // Try native detect first
    if (!is(values, 'undefined')) {
      var result = nativeTestProps(props, values);
      if(!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, j, prop, value;

    // If we don't have a style element, that means
    // we're running async or after the core tests,
    // so we'll need to create our own elements to use
    if ( !mStyle.style ) {
      afterInit = true;
      mStyle.modElem = createElement('modernizr');
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we
    // we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    for ( i in props ) {
      prop = props[i];
      if ( !contains(prop, "-") && mStyle.style[prop] !== undefined ) {

        // If values to test have been passed in, do a set-and-check test
        if (!is(values, 'undefined')) {
          j = values.length;
          while (j--) {
            value = values[j];
            mStyle.style[prop] = value;
            if (mStyle.style[prop] == value) {
              cleanElems();
              return prefixed == 'pfx' ? prop : true;
            }
          }
        }
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  return testProps;
});
