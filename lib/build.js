/* jshint node: true */
module.exports = function (opts, callback) {
  "use strict";

  opts = opts || {};

  var cwd = process.cwd();

  var grunt = require("grunt");
  var path = require("path");
  var cp = require("child_process");
  var fs = require("fs");

  // Temporarily change working dir to Modernizr root
  process.chdir(path.join(__dirname, ".."));

  var Gruntfile = require(path.join(__dirname, "..", "Gruntfile"))(grunt);
  var settings = grunt.config();

  var verbose = (opts.verbose !== false);
  delete opts.verbose;

  if (typeof opts !== "undefined") {
    var configPath = path.join(__dirname, "config-all.json");

    if (fs.existsSync(configPath)) {
      var modernizrConfig = grunt.file.readJSON(configPath);

      for (var key in opts) {
        modernizrConfig[key] = opts[key];
      }

      grunt.file.write(configPath, JSON.stringify(modernizrConfig, null, 2));
    }
  }

  var build = cp.spawn("grunt", ["build"], {
    stdio: verbose ? "inherit" : [0, "pipe", 2]
  });

  build.on("exit", function (code) {
    var uglify = settings.uglify || {};
    var source = uglify.dist.src[0];
    var dest = uglify.dist.dest;

    if (source && dest && typeof callback === "function") {
      callback.call(grunt, {
        code: grunt.file.read(source),
        min: grunt.file.read(dest)
      });
    }

    // Switch working directory back to original
    process.chdir(cwd);
    process.exit(code);
  });
};
