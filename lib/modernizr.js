'use strict';

// Generate a custom Modernizr build and related metadata.
// Usage:
//   require('modernizr').build(config, options);
//   require('modernizr').metadata(callback);
// Arguments:
//   See lib/generate-build.js and lib/generate-metadata.js for argument
//     documentation.

module.exports = {
  build: require('./generate-build'),
  metadata: require('./generate-metadata')
};
