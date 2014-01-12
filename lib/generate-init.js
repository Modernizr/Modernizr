/* jshint node: true */
'use strict';

// Return a string containing a require.js init file for a custom Modernizr build.
// Arguments:
//  config (Object, required): A Modernizr configuration object. See
//    lib/config-all.json for an example.

module.exports = function generateInit(config) {
  var _ = require('underscore');

  // Defaults so later calls don't explode
  config.options = config.options || [];
  config['feature-detects'] = config['feature-detects'] || [];

  // Special cases that need more than concatenation
  var setClasses = _(config.options).contains('setClasses');

  // Remove the special cases
  config.options = _(config.options).without('setClasses');

  // Begin building file
  var output = 'require(["ModernizrProto", "Modernizr", "testRunner"';

  // Special case requires
  if (setClasses) {
    output += ', "setClasses", "classes"';
  }

  // Load in the rest of the options (they dont return values, so they aren't
  // declared)
  config.options.forEach(function (option) {
    output += ', "' + option + '"';
  });

  // Load in all the feature detects
  config['feature-detects'].forEach(function (detect) {
    output += ', "test/' + detect + '"';
  });

  output += '], function( ModernizrProto, Modernizr, testRunner';

  // Special case module declarations
  if (setClasses) {
    output += ', setClasses, classes';
  }

  output += ') {\n' +
  '  // Run each test\n' +
  '  testRunner();\n' +
  '\n';

  // Run the setClasses function
  if (setClasses) {
    output += '  // Remove the "no-js" class if it exists\n' +
    '  setClasses(classes);\n' +
    '\n';
  }

  output += '  delete ModernizrProto.addTest;\n' +
  '  delete ModernizrProto.addAsyncTest;\n' +
  '\n';

  // TODO: if there's a way to figure out if there will be no
  // items in this queue, then we could avoid the code.
  output += '  // Run the things that are supposed to run after the tests\n' +
  '  for (var i = 0; i < Modernizr._q.length; i++) {\n' +
  '    Modernizr._q[i]();\n' +
  '  }\n\n';

  output += '  // Leak Modernizr namespace\n' +
  '  window.Modernizr = Modernizr;\n' +
  '\n' +
  '});';

  return output;
};
