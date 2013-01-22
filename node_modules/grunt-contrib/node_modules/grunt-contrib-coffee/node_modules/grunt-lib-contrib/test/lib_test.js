var grunt = require('grunt');
var helper = require('../lib/contrib.js').init(grunt);

exports.lib = {
  findBasePath: function(test) {
    'use strict';
    var path = require('path');

    test.expect(3);

    var actual = helper.findBasePath(['dir1/dir2/dir3/file.ext', 'dir1/dir2/another.ext', 'dir1/dir2/dir3/dir4/file.ext']);
    var expected = path.normalize('dir1/dir2');
    test.equal(expected, actual, 'should detect basePath from array of filepaths.');

    actual = helper.findBasePath(['dir1/dir2/dir3/file.ext', 'dir1/dir2/another.ext', 'file.ext'], 'dir1');
    expected = 'dir1';
    test.equal(expected, actual, 'should default to passed basePath if valid');

    actual = helper.findBasePath(['.dir1/dir2', '.dir1/dir2/another.ext', '.dir1/dir2/dir3/dir4/file.ext', 'file.ext']);
    expected = '';
    test.equal(expected, actual, 'should return empty string if foundPath is a single dot (helps with dotfiles)');

    test.done();
  },
  getNamespaceDeclaration: function(test) {
    'use strict';

    test.expect(10);

    // Both test should result in this[JST]
    var expected = {
      namespace: 'this["JST"]',
      declaration: 'this["JST"] = this["JST"] || {};'
    };

    var actual = helper.getNamespaceDeclaration("this.JST");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    actual = helper.getNamespaceDeclaration("JST");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    // Templates should be declared globally if this provided
    expected = {
      namespace: "this",
      declaration: ""
    };

    actual = helper.getNamespaceDeclaration("this");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    // Nested namespace declaration
    expected = {
      namespace: 'this["GUI"]["Templates"]["Main"]',
      declaration:  'this["GUI"] = this["GUI"] || {};\n' +
                    'this["GUI"]["Templates"] = this["GUI"]["Templates"] || {};\n' +
                    'this["GUI"]["Templates"]["Main"] = this["GUI"]["Templates"]["Main"] || {};'
    };

    actual = helper.getNamespaceDeclaration("GUI.Templates.Main");
    test.equal(expected.namespace, actual.namespace, 'namespace incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration incorrect');

    // Namespace that contains square brackets
    expected = {
      namespace: 'this["main"]["[test]"]["[test2]"]',
      declaration: 'this["main"] = this["main"] || {};\n' +
                   'this["main"]["[test]"] = this["main"]["[test]"] || {};\n' +
                   'this["main"]["[test]"]["[test2]"] = this["main"]["[test]"]["[test2]"] || {};'
    };

    actual = helper.getNamespaceDeclaration("main.[test].[test2]");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    test.done();
  },
  options: function(test) {
    'use strict';

    test.expect(5);

    var options = helper.options({name: 'test_task', target: 'target'}, {required: 'default'});

    var actual = options.param;
    var expected = 'target';
    test.equal(expected, actual, 'should allow target options key to override task');

    actual = options.param2;
    expected = 'task';
    test.equal(expected, actual, 'should set default task options that can be overriden by target options');

    actual = options.required;
    expected = 'default';
    test.equal(expected, actual, 'should allow task to define default values');

    actual = options.template;
    expected = 'source/';
    test.equal(expected, actual, 'should automatically process template vars');

    actual = options.data.template;
    expected = 'source/';
    test.equal(expected, actual, 'should process template vars recursively');

    test.done();
  },
  optsToArgs: function(test) {
    'use strict';

    test.expect(1);

    var fixture = {
      key: 'a',
      key2: 1,
      key3: true,
      key4: false,
      key5: ['a', 'b']
    };
    var expected = ['--key', 'a', '--key2', '1', '--key3', '--key5', 'a', '--key5', 'b' ].toString();
    var actual = helper.optsToArgs(fixture).toString();
    test.equal(expected, actual, 'should convert object to array of CLI arguments');

    test.done();
  }
};
