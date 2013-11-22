/*!
 {
 "name": "input[accept] Attribute",
 "property": "accept",
 "notes": [{
 "name": "WHATWG Spec",
 "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#attr-input-accept"
 }, {
 "name": "Wufoo demo",
 "href": "http://www.wufoo.com/html5/attributes/07-accept.html"
 }]
 }
 !*/
/* DOC

 When used on an `<input type="file">`, the `accept` attribute limits the file selection
 dialog to certain MIME types, including the audio/*, video/*, and image/*.

 */
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
    Modernizr.addTest('inputaccept', 'accept' in createElement('input'));
});