define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses( classes ) {
    var className = docElement.className;
    var removeClasses = [];
    var regex;

    // Change `no-js` to `js` (we do this regardles of the `enableClasses`
    // option)
    className = className.replace(/(^|\s)no-js(\s|$)/, '$1js$2');

    if(Modernizr._config.enableClasses) {
      // Need to remove any existing `no-*` classes for features we've detected
      for(var i = 0; i < classes.length; i++) {
        if(!classes[i].match('^no-')) {
          removeClasses.push('no-' + classes[i]);
        }
      }

      // Use a regex to remove the old...
      regex = new RegExp('(^|\\s)' + removeClasses.join('|') + '(\\s|$)', 'g');
      className = className.replace(regex, '$1$2');

      // Then add the new...
      className += ' ' + classes.join(' ' + (Modernizr._config.classPrefix || ''));

      // Apply
      docElement.className = className;
    }

  }

  return setClasses;
});
