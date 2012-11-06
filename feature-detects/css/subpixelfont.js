define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  /*
   * Test for SubPixel Font Rendering
   * (to infer if GDI or DirectWrite is used on Windows)
   * Authors: @derSchepp, @gerritvanaaken, @rodneyrehm, @yatil, @ryanseddon
   * Web: https://github.com/gerritvanaaken/subpixeldetect
   */
  testStyles(
    '#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}',
  function( elem ) {
    var subpixel = elem.firstChild;
    subpixel.innerHTML = 'This is a text written in Arial';
    Modernizr.addTest('subpixelfont', window.getComputedStyle ?
      window.getComputedStyle(subpixel, null).getPropertyValue("width") !== '44px'
    : false);
  }, 1, ['subpixel']);
});
