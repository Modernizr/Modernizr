define(['Modernizr'], function( Modernizr ) {
  // Detect support for native binary data manipulation.
  // This detection will check for everything except DataView, since versions of
  //  Firefox < 15 do not have support.
  //  Use Modernizr.dataview for DataView detection
  // Should fail in:
  // Internet Explorer <= 9
  // Firefox <= 3.6
  // Chrome <= 6.0
  // iOS Safari < 4.2
  // Safari < 5.1
  // Opera < 11.6
  // Opera Mini, <= 7.0
  // Android Browser < 4.0
  // Blackberry Browser < 10.0
  // CanIUse Compatibility Reference: http://caniuse.com/typedarrays
  // Mozilla Developer Network:
  //   https://developer.mozilla.org/en-US/docs/JavaScript_typed_arrays
  // TypedArray Specification:
  //   http://www.khronos.org/registry/typedarray/specs/latest/
  //
  // by Stanley Stuart <fivetanley>

  Modernizr.addTest('typedarrays', 'ArrayBuffer' in window );
});
