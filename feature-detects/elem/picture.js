/*!
{
  "name": "picture Element",
  "property": "picture",
  "tags": ["elem"],
  "authors": ["Scott Jehl", "Mat Marquis"],
  "notes": [{
    "name": "Specification",
    "href": "http://w3c.github.io/html/semantics-embedded-content.html#the-picture-element"
  },{
    "name": "Relevant spec issue",
    "href": "https://github.com/ResponsiveImagesCG/picture-element/issues/87"
  }]
}
!*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('picture', 'HTMLPictureElement' in window);
});
