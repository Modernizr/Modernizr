define(['Modernizr', 'docElement', 'classes'], function( Modernizr, docElement, classes ) {
  // Pass in an element to this function
  // if you'd like to change the classe on
  // something other than the html element.
  function setClasses( elem ) {
    var theElem = elem || docElement;
    // Remove "no-js" class from <html> element, if it exists:
    theElem.className = theElem.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
                           // Add the new classes to the <html> element.
                           (Modernizr._config.enableClasses ? ' js ' + (classes.length ? Modernizr._config.classPrefix || '' : '') + classes.join(' ' + (Modernizr._config.classPrefix || '')) : '');
  }

  return setClasses;
});
