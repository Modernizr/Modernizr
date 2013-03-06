/*!
{
  "name": "Border Image",
  "property": "borderimage",
  "caniuse": "border-image",
  "polyfills": ["css3pie"],
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
    // Use border-image-width with 0px because it's basically a no-op and is
    // quicker than defining an image without spewing warnings into the console
    Modernizr.addTest('borderimage', testAllProps('borderImageWidth', '0px'));
});
