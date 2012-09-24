
Modernizr.addTest('csstransforms3d', function() {

    var ret = !!Modernizr.testAllProps('perspective');

    // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
    //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    //   some conditions. As a result, Webkit typically recognizes the syntax but
    //   will sometimes throw a false positive, thus we must do a more thorough check:
    if ( ret && 'webkitPerspective' in document.documentElement.style ) {

      // Webkit allows this media query to succeed only if the feature is enabled.
      // `@media (transform-3d),(-webkit-transform-3d){ ... }`
      Modernizr.testStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
      });
    }
    return ret;
});
