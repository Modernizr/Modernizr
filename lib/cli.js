#!/usr/bin/env node
'use strict';

// Expose a nice cli to the user.
// Usage:
//   $ modernizr
//   $ modernizr --config ./my-config.json --dest ./build/modernizr-build.js --min
//   $ modernizr -c ./my-config.json -d ./build/modernizr-build.js -m
// Arguments:
//   --config, -c: Path to a JSON file containing Modernizr configuration.
//     See lib/config-all.json for an example. If you don't provide
//     a configuration file Modernizr will output a development build with
//     all feature detects.
//   --dest, -d: Path to write the build file to.
//   --min, -m: Minify the output file.
//   --verbose, -v: Show verbose output.
//   --help, -h: Show help.

var fs = require('fs');
var path = require('path');
var nopt = require('nopt');
var mkdirp = require('mkdirp');
var modernizr = require(path.resolve(__dirname, 'modernizr'));

var opts = nopt({
  config: [path, null],
  dest: [path, null],
  min: [Boolean, null],
  verbose: [Boolean, null],
  help: [Boolean, null]
}, {
  c: '--config',
  d: '--dest',
  m: '--min',
  v: '--verbose',
  h: '--help'
});

if (opts.help) {
  var help = '\n' +
    '  Modernizr Build CLI\n\n' +
    '  --config, -c: Path to a JSON file containing Modernizr configuration.\n' +
    '    See lib/config-all.json for an example. If you don\'t provide\n' +
    '    a configuration file Modernizr will output a development build with\n' +
    '    all feature detects.\n\n' +
    '  --dest, -d: Path to write the build file to.\n\n' +
    '  --min, -m: Minify the output file.\n\n' +
    '  --verbose, -v: Show verbose output.\n\n' +
    '  --help, -h: Show help.\n';

  console.log(help);
}
else {
  var configPath = opts.config ||  path.resolve(__dirname, 'config-all.json');
  var config = require(configPath);
  var dest = opts.dest === undefined ? './modernizr.js' : opts.dest;
  var options = {};

  if (opts.min !== undefined) {
    options.min = opts.min;
  }

  if (opts.verbose !== undefined) {
    options.verbose = opts.verbose;
  }

  options.callback = function(output) {
    try {
      mkdirp.sync(path.dirname(dest));
      fs.writeFile(dest, output);
      if (options.verbose) {
        console.log('Custom Modernizr build written to ' + dest + '!');
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  // Run modernizr build
  modernizr.build(config, options);
}
