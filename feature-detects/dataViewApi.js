// DataView 
// https://developer.mozilla.org/en/JavaScript_typed_arrays/DataView
// By Addy Osmani
Modernizr.addTest('dataView', (typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype));