/*!
{
  "name": "time Element",
  "property": "time",
  "tags": ["elem"],
  "builderAliases": ["elem_time"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element"
  }]
}
!*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('time', 'valueAsDate' in createElement('time'));
});
