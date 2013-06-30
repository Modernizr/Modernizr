define(['tests', 'Modernizr', 'classes', 'is'], function( tests, Modernizr, classes, is ) {
  // Run through all tests and detect their support in the current UA.
  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    for ( var featureIdx in tests ) {
      featureNames = [];
      feature = tests[featureIdx];
      // run the test, throw the return value into the Modernizr,
      //   then based on that boolean, define an appropriate className
      //   and push it into an array of classes we'll join later.
      featureNames.push(feature.name.toLowerCase());

      if (feature.options && feature.options.aliases && feature.options.aliases.length) {
        // Add all the aliases into the names list
        for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
          featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
        }
      }

      // Async tests are set to undefined at first, defined later: Issue #969
      // Run the test, or use the raw value if it's not a function
      result = feature.async ? undefined : (is(feature.fn, 'function') ? feature.fn() : feature.fn);

      // Set each of the names on the Modernizr object
      for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
        Modernizr[featureNames[nameIdx]] = result;

        // Don't add classes when async
        // We've considered some initial state class, but so far haven't loved any solutions
        if (!feature.async) {
          classes.push((Modernizr[featureNames[nameIdx]] ? '' : 'no-') + featureNames[nameIdx]);
        }
      }
    }
  }

  return testRunner;
});
