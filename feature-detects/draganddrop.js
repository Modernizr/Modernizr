/*!
{
  "name": "Drag & Drop",
  "property": "draganddrop",
  "caniuse": "dragndrop",
  "knownBugs": ["Mobile browsers like Android, iOS < 6, and Firefox OS technically support the APIs, but don't expose it to the end user, resulting in a false positive."],
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/TR/2010/WD-html5-20101019/dnd.html"
  }],
  "polyfills": ["dropfile", "moxie", "fileapi"]
}
!*/
/* DOC

Detects support for native drag & drop of elements.

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('draganddrop', function() {
    var div = createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
  });
});
