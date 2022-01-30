/*!
{
  "name": "area[ping] Attribute",
  "property": "areaping",
  "caniuse": "ping",
  "tags": ["media", "attribute"],
  "builderAliases": ["area_ping"],
  "authors": ["Hélio Correia (@heliocorreia)"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/dev/links.html#ping"
  }]
}
!*/
/* DOC
The ping attribute, if present, gives the URLs of the resources that are interested in being notified if the user follows the hyperlink.
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('areaping', !window.externalHost && 'ping' in createElement('area'));
});
