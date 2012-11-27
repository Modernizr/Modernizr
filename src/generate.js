define(['underscore'], function( _ ) {
  return function( config ) {
    // Set some defaults
    config.options = config.options || [
      "setClasses",
      "html5shiv",
      "addTest"
    ];
    config["feature-detects"] = config["feature-detects"] || [];

    // Some special cases
    var setClasses = _(config.options).contains('setClasses');
    var addTest = _(config.options).contains('addTest');

    // Remove the special cases
    config.options = _(config.options).without('setClasses', 'addTest');

    var output = 'require(["ModernizrProto", "Modernizr", "testRunner"';

    // Needed named module requires
    if (setClasses) {
      output += ', "setClasses"';
    }
    if (addTest) {
      output += ', "addTest"';
    }

    // Load in the rest of the options (they dont return values, so they aren't declared
    _(config.options).forEach(function (option) {
      output += ', "' + option + '"';
    });

    // Load in all the detects
    _(config["feature-detects"]).forEach(function (detect) {
      output += ', "' + detect + '"';
    });

    output += '], function( ModernizrProto, Modernizr, testRunner';

    // Needed named module declarations
    if (setClasses) {
      output += ', setClasses';
    }
    if (addTest) {
      output += ', addTest';
    }

    output += ') {\n' +
    '    // Run each test\n' +
    '  testRunner();\n' +
    '\n';

    // Actually run the setClasses function
    if (setClasses) {
      output += '  // Remove the "no-js" class if it exists\n' +
      '  setClasses();\n' +
      '\n';
    }

    // Leak the user-facing addTest if they want it
    if (addTest) {
      output += '  // Ovveride the addTest class with one that works\n' +
      '  // after the tests have run and kill the async\n' +
      '  // test function, since it doesn\'t make sense anymore\n' +
      '  ModernizrProto.addTest = addTest;\n';
    }
    // Otherwise remove the useless one
    else {
      output += '  delete ModernizrProto.addTest;\n';
    }

    output += '  delete ModernizrProto.addAsyncTest;\n' +
    '\n';

    output += '  // Leak Modernizr namespace\n' +
    '  window.Modernizr = Modernizr;\n' +
    '\n' +
    '});';

    return output;
  };
});
