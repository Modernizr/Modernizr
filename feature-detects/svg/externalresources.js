/*!
{
  "name": "SVG External Resources",
  "property": "externalresources",
  "authors": ["Moritz Schramm"],
  "tags": ["svg"]
}
!*/
/* DOC
Detects support for External Resources in SVG.

See [this discussion](https://github.com/Modernizr/Modernizr/issues/1409) regarding SVG external content.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('externalresources', function() {
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#ExternalResourcesRequired', '1.1');
  });
});
