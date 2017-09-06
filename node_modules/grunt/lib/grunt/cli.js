'use strict';

var grunt = require('../grunt');

// External libs.
var nopt = require('nopt');
var gruntOptions = require('grunt-known-options');

// This is only executed when run via command line.
var cli = module.exports = function(options, done) {
  // CLI-parsed options override any passed-in "default" options.
  if (options) {
    // For each default option...
    Object.keys(options).forEach(function(key) {
      if (!(key in cli.options)) {
        // If this option doesn't exist in the parsed cli.options, add it in.
        cli.options[key] = options[key];
      } else if (cli.optlist[key].type === Array) {
        // If this option's type is Array, append it to any existing array
        // (or create a new array).
        [].push.apply(cli.options[key], options[key]);
      }
    });
  }

  // Run tasks.
  grunt.tasks(cli.tasks, cli.options, done);
};

// Default options.
var optlist = cli.optlist = gruntOptions;

// Parse `optlist` into a form that nopt can handle.
var aliases = {};
var known = {};

Object.keys(optlist).forEach(function(key) {
  var short = optlist[key].short;
  if (short) {
    aliases[short] = '--' + key;
  }
  known[key] = optlist[key].type;
});

var parsed = nopt(known, aliases, process.argv, 2);
cli.tasks = parsed.argv.remain;
cli.options = parsed;
delete parsed.argv;

// Initialize any Array options that weren't initialized.
Object.keys(optlist).forEach(function(key) {
  if (optlist[key].type === Array && !(key in cli.options)) {
    cli.options[key] = [];
  }
});
