'use strict';

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var modernizr = require(path.join(cwd, 'lib/modernizr'));

exports.build = function (test) {
  test.expect(1);
  test.equal(typeof modernizr.build, 'function', 'Should export build function');
  test.done();
};

exports.buildAll = function (test) {
  var config = require(path.join(cwd, 'lib', 'config-all.json'));

  test.expect(4);
  modernizr.build(config, {
    verbose: false,
    dest: false,
    callback: function (output) {
      var missingFeatures = false;

      config['feature-detects'].forEach(function (feature) {
        feature = feature.match(/([^\/]+$)/)[0];
        if (output.indexOf(feature) === -1) {
          missingFeatures = true;
        }
      });

      test.ok(true, 'Should finish build without errors');
      test.ok(missingFeatures, 'Should find all feature-detects given in config-all.json');
      test.notEqual(output.indexOf('function shivPrint'), -1, 'Should find the print shiv');
      test.notEqual(output.indexOf('// yepnope.js'), -1, 'Should find yepnope');
      test.done();
    }
  });
};

exports.buildCustom = function (test) {
  var config = {
    'classPrefix': 'modz',
    'options': [
      'setClasses',
      'addTest',
      'testProp',
      'fnBind'
    ],
    'feature-detects': [
      'test/css/boxsizing',
      'test/dom/classlist'
    ]
  };

  test.expect(7);
  modernizr.build(config, {
    verbose: false,
    dest: false,
    callback: function (output) {
      test.ok(true, 'should finish build without errors');
      test.notEqual(output.indexOf('classPrefix: \'modz\''), -1, 'Should set custom class');
      test.equal(output.indexOf('function shivPrint'), -1, 'Should not find the print shiv');
      test.equal(output.indexOf('// yepnope.js'), -1, 'Should not find yepnope');
      test.notEqual(output.indexOf('boxsizing'), -1, 'Should find test for boxsizing');
      test.notEqual(output.indexOf('classlist'), -1, 'Should find test for classlist');
      test.equal(output.indexOf('cssanimations'), -1, 'Should not find test for cssanimations');
      test.done();
    }
  });
};
