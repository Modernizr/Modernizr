/*!
{
  "name": "Custom Elements API",
  "property": "customelements",
  "tags": ["customelements"],
  "polyfills": ["customelements"],
  "notes": [{
    "name": "Specs for Custom Elements",
    "href": "https://www.w3.org/TR/custom-elements/"
  }]
}
!*/
/* DOC
Detects support for the Custom Elements API, to create custom html elements via js
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('customelements', 'customElements' in window);
});
