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
//   --metadata, -m: Output Modernizr project metadata as a JSON file.
//   --dest, -d: Path to write the build or metadata file to. Defaults to
//     ./modernizr.js for a Modernizr build, or ./metadata.json when used
//     with --metadata.
//   --uglify, -u: Minify/uglify the output file.
//   --quiet, -q: Don't show confirmation output.
//   --help, -h: Show help.

var fs = require('fs');
var path = require('path');
var nopt = require('nopt');
var mkdirp = require('mkdirp');
var modernizr = require(path.resolve(__dirname, 'modernizr'));

var opts = nopt({
  config: [path, null],
  metadata: [Boolean],
  dest: [path, null],
  uglify: [Boolean],
  quiet: [Boolean],
  help: [Boolean]
}, {
  c: '--config',
  d: '--dest',
  u: '--uglify',
  v: '--quiet',
  m: '--metadata',
  h: '--help'
});

if (opts.help) {
  var help = '\n' +
    '  Modernizr Build CLI\n\n' +
    '  --config, -c: Path to a JSON file containing Modernizr configuration.\n' +
    '    See lib/config-all.json for an example. If you don\'t provide\n' +
    '    a configuration file Modernizr will output a development build with\n' +
    '    all feature detects.\n\n' +
    '  --metadata, -m: Output Modernizr project metadata as a JSON file.\n\n' +
    '  --dest, -d: Path to write the build or metadata file to. Defaults to\n' +
    '    ./modernizr.js for a Modernizr build, or ./metadata.json when used\n' +
    '    with --metadata.\n\n' +
    '  --uglify, -u: Minify/uglify the output file.\n\n' +
    '  --quiet, -v: Don\'t show confirmation output.\n\n' +
    '  --help, -h: Show help.\n';

  console.log(help);
}
else if (opts.metadata) {
  var dest = opts.dest === undefined ? './metadata.js' : opts.dest;

  modernizr.metadata(function (output) {
    try {
      mkdirp.sync(path.dirname(dest));
      fs.writeFile(dest, output);
      if (!opts.quiet) {
        console.log('Modernizr metadata written to ' + dest + '!');
      }
    }
    catch (err) {
      console.log(err);
    }
  });
}
else {
  var configPath = opts.config ||  path.resolve(__dirname, 'config-all.json');
  var config = require(configPath);
  var dest = opts.dest === undefined ? './modernizr.js' : opts.dest;
  var options = {};

  if (opts.uglify !== undefined) {
    options.min = opts.uglify;
  }

  options.callback = function(output) {
    try {
      mkdirp.sync(path.dirname(dest));
      fs.writeFile(dest, output);
      if (!opts.quiet) {
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
