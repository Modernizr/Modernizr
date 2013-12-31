/* jshint node: true */

module.exports = function (opts, callback) {
  'use strict';

  // Usage:
  // require('modernizr').build(config, callback);
  //
  // Where:
  // config - A JSON object of config options (see ./lib/config-all.json)
  // callback - A callback function once build completes

  opts = opts || {};

  var cwd = process.cwd();
  var path = require('path');
  var cp = require('child_process');
  var fs = require('fs');

  var localRoot = path.join(__dirname, '..');

  // Temporarily change working dir to Modernizr root
  process.chdir(localRoot);

  // Context-sensitive requires
  var grunt = require('grunt');

  // So we don't make path assumptions, we load the current Gruntfile
  require(path.join(localRoot, 'Gruntfile'))(grunt);

  // and store our config options for later use.
  var settings = grunt.config();

  // White noise suppression
  var verbose = (opts.verbose !== false);
  delete opts.verbose;

  if (typeof opts !== 'undefined') {
    var configPath = path.join(__dirname, 'config-all.json');

    if (fs.existsSync(configPath)) {
      var modernizrConfig = grunt.file.readJSON(configPath);

      for (var key in opts) {
        modernizrConfig[key] = opts[key];
      }

      grunt.file.write(configPath, JSON.stringify(modernizrConfig, null, 2));
    }
  }

var build = cp.spawn(__dirname + '/../node_modules/.bin/' + 'grunt', ['build'], {
    stdio: verbose ? 'inherit' : [0, 'pipe', 2],
    cwd: localRoot
  });

  build.on('exit', function (code) {

    // Ensure uglify is defined
    var uglify = (settings.uglify || {}).dist || {};

    // Read concat / minified source
    var source, dest;

    if (uglify.src && fs.existsSync(uglify.src[0])) {
      source = grunt.file.read(uglify.src[0]);
    }

    if (uglify.dest && fs.existsSync(uglify.dest)) {
      dest = grunt.file.read(uglify.dest);
    }

    // Switch working directory back to original
    process.chdir(cwd);

    // If callback is defined, invoke it
    if (typeof callback === 'function') {
      callback({
        code: source,
        min: dest
      });
    } else {
      return process.exit(code);
    }
  });
};
