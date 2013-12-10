define(['underscore'], function( _ ) {
  return function( config ) {
    // Set some defaults
    if (!config) {
      config = {};
    }
    config.options = config.options || [];
    config['feature-detects'] = config['feature-detects'] || [];

    // Some special cases
    var setClasses = _(config.options).contains('setClasses');

    // Remove the special cases
    config.options = _(config.options).without('setClasses');

    var output = 'require(["ModernizrProto", "Modernizr", "testRunner"';

    // Needed named module requires
    if (setClasses) {
      output += ', "setClasses", "classes"';
    }

    // Load in the rest of the options (they dont return values, so they aren't declared
    _(config.options).forEach(function (option) {
      output += ', "' + option + '"';
    });

    // Load in all the detects
    _(config['feature-detects']).forEach(function (detect) {
      output += ', "' + detect + '"';
    });

    output += '], function( ModernizrProto, Modernizr, testRunner';

    // Needed named module declarations
    if (setClasses) {
      output += ', setClasses, classes';
    }

    output += ') {\n' +
    '  // Run each test\n' +
    '  testRunner();\n' +
    '\n';

    // Actually run the setClasses function
    if (setClasses) {
      output += '  // Remove the "no-js" class if it exists\n' +
      '  setClasses(classes);\n' +
      '\n';
    }

    output += '  delete ModernizrProto.addTest;\n';
    output += '  delete ModernizrProto.addAsyncTest;\n' +
    '\n';

    // TODO:: if there's a way to figure out if there will be no
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
});
