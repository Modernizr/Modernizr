/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
  ]
}
!*/
/* DOC
Detects support for the latest syntax for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.

Modernizr has 4 detects related to Flexbox:

* `flexbox` – this detect, checks for the latest, standard syntax
* `flexboxlegacy` – checks for the old syntax
* `flexboxtweener` – checks for the ‘inbetween’ syntax (implemented by IE10 & IE11)
* `flexwrap` – specifically checks for the `flex-wrap` property, which is missing from some implementations

A fully-comprehensive pattern for presenting a flex layout in as many browser as possible might look like this:

```
.flexbox .module {
    // Modern syntax
}
.flexboxtweener.no-flexbox .module {
    // IE10 syntax
}
.flexboxlegacy.no-flexbox .module {
    // Old syntax
}
.no-flexbox.no-flexboxtweener.no-flexboxlegacy .module {
    // No-flexbox fallback
}
```

*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));
});
