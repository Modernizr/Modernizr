/*!
{
  "name": "CSS Background Clip Text",
  "property": "backgroundcliptext",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Tricks Article",
      "href": "http://css-tricks.com/image-under-text/"
    },
    {
      "name": "MDN Docs",
      "href": "http://developer.mozilla.org/en/CSS/background-clip"
    },
    {
      "name": "Related Github Issue",
      "href": "http://github.com/Modernizr/Modernizr/issues/199"
    }
  ]
}
!*/
define(['Modernizr', 'createElement', 'cssomPrefixes'], function( Modernizr, createElement, cssomPrefixes ) {
  Modernizr.addTest('backgroundcliptext', function() {
    var element = createElement('x');
    var ucProp = 'BackgroundClip';
    var props = ('backgroundClip ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
    element.style.cssText = Modernizr._prefixes.join('background-clip:text;');
    for ( var i in props ) {
      if ( element.style[props[i]] === 'text' ) {
        return true;
      }
    }
    return false;
  });
});
