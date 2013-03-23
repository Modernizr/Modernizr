define(['Modernizr', 'docElement', 'classes'], function( Modernizr, docElement, classes ) {
  // Pass in an element to this function
  // if you'd like to change the classe on
  // something other than the html element.
  function setClasses( elem ) {
    var theElem = elem || docElement,
        features = classes.concat('js'),
        featurePattern = new RegExp('(^|\\s)no-(' + features.join('|') + ')(\\s|$)', 'g')

    theElem.className =
      // Remove relevant 'no-<feature>' classes
      theElem.className.replace(featurePattern, '$1$3') +
      // Add the new classes to the <html> element.
      (Modernizr._config.enableClasses ? ' js ' + (classes.length ? Modernizr._config.classPrefix || '' : '') + classes.join(' ' + (Modernizr._config.classPrefix || '')) : '');
  }

  return setClasses;
});
