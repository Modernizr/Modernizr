/*!
{
  "name": "Get Battery",
  "property": "getbattery",
  "aliases": ["get-battery"],
  "builderAliases": ["get_battery"],
  "tags": ["device", "media"],
  "authors": ["Alex Bradley (abrad1212)"],
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery"
  }]
}
!*/
/* DOC
Detect support for the Get Battery API, for accessing information about the system's battery charge level.
*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('getbattery', !!prefixed('getbattery', navigator), {aliases: ['get-battery']});
});
