/* jshint node: true */
"use strict";

var fs = require("fs");
var path = require("path");
var cwd = process.cwd();

var config = path.join(cwd, "lib", "config-all.json");
var _cache;

exports.setUp = function (callback) {
  _cache = fs.readFileSync(config, "utf8");
  callback();
};

exports.build = function (test) {
  test.expect(3);
  var modernizr = require(path.join(cwd, "lib", "cli"));

  test.ok(modernizr.build, "should export build function");
  test.equal(typeof modernizr.build, "function", "modernizr.build should be a function");

  modernizr.build({
    "verbose": false
  }, function () {
    test.ok(true, "should finish build without errors");
    test.done();
  });
};

exports.buildCustom = function (test) {
  test.expect(6);
  var modernizr = require(path.join(cwd, "lib", "cli"));

  test.ok(modernizr.build, "should export build function");
  test.equal(typeof modernizr.build, "function", "modernizr.build should be a function");

  modernizr.build({
    "feature-detects": [
      "test/css/boxsizing",
      "test/dom/classlist"
    ],
    "verbose": false
  }, function () {
    test.ok(true, "should finish build without errors");
    var file = fs.readFileSync(path.join(cwd, "dist", "modernizr-build.js"), "utf8");

    test.notEqual(file.indexOf("boxsizing"), -1, "Should find test for boxsizing");
    test.notEqual(file.indexOf("classlist"), -1, "Should find test for classlist");

    test.equal(file.indexOf("cssanimations"), -1, "Should not find test for cssanimations");

    test.done();
  });
};

exports.tearDown = function (callback) {
  fs.writeFileSync(config, _cache);
  callback();
};
