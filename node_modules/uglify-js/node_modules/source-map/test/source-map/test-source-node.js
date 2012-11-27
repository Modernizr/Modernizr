/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('../../lib/source-map/source-map-generator').SourceMapGenerator;
  var SourceMapConsumer = require('../../lib/source-map/source-map-consumer').SourceMapConsumer;
  var SourceNode = require('../../lib/source-map/source-node').SourceNode;

  exports['test .add()'] = function (assert, util) {
    var node = new SourceNode(null, null, null);

    // Adding a string works.
    node.add('function noop() {}');

    // Adding another source node works.
    node.add(new SourceNode(null, null, null));

    // Adding an array works.
    node.add(['function foo() {',
              new SourceNode(null, null, null,
                             'return 10;'),
              '}']);

    // Adding other stuff doesn't.
    assert.throws(function () {
      node.add({});
    });
    assert.throws(function () {
      node.add(function () {});
    });
  };

  exports['test .prepend()'] = function (assert, util) {
    var node = new SourceNode(null, null, null);

    // Prepending a string works.
    node.prepend('function noop() {}');
    assert.equal(node.children[0], 'function noop() {}');
    assert.equal(node.children.length, 1);

    // Prepending another source node works.
    node.prepend(new SourceNode(null, null, null));
    assert.equal(node.children[0], '');
    assert.equal(node.children[1], 'function noop() {}');
    assert.equal(node.children.length, 2);

    // Prepending an array works.
    node.prepend(['function foo() {',
              new SourceNode(null, null, null,
                             'return 10;'),
              '}']);
    assert.equal(node.children[0], 'function foo() {');
    assert.equal(node.children[1], 'return 10;');
    assert.equal(node.children[2], '}');
    assert.equal(node.children[3], '');
    assert.equal(node.children[4], 'function noop() {}');
    assert.equal(node.children.length, 5);

    // Prepending other stuff doesn't.
    assert.throws(function () {
      node.prepend({});
    });
    assert.throws(function () {
      node.prepend(function () {});
    });
  };

  exports['test .toString()'] = function (assert, util) {
    assert.equal((new SourceNode(null, null, null,
                                 ['function foo() {',
                                  new SourceNode(null, null, null, 'return 10;'),
                                  '}'])).toString(),
                 'function foo() {return 10;}');
  };

  exports['test .join()'] = function (assert, util) {
    assert.equal((new SourceNode(null, null, null,
                                 ['a', 'b', 'c', 'd'])).join(', ').toString(),
                 'a, b, c, d');
  };

  exports['test .walk()'] = function (assert, util) {
    var node = new SourceNode(null, null, null,
                              ['(function () {\n',
                               '  ', new SourceNode(1, 0, 'a.js', ['someCall()']), ';\n',
                               '  ', new SourceNode(2, 0, 'b.js', ['if (foo) bar()']), ';\n',
                               '}());']);
    var expected = [
      { str: '(function () {\n', source: null,   line: null, column: null },
      { str: '  ',               source: null,   line: null, column: null },
      { str: 'someCall()',       source: 'a.js', line: 1,    column: 0    },
      { str: ';\n',              source: null,   line: null, column: null },
      { str: '  ',               source: null,   line: null, column: null },
      { str: 'if (foo) bar()',   source: 'b.js', line: 2,    column: 0    },
      { str: ';\n',              source: null,   line: null, column: null },
      { str: '}());',            source: null,   line: null, column: null },
    ];
    var i = 0;
    node.walk(function (chunk, loc) {
      assert.equal(expected[i].str, chunk);
      assert.equal(expected[i].source, loc.source);
      assert.equal(expected[i].line, loc.line);
      assert.equal(expected[i].column, loc.column);
      i++;
    });
  };

  exports['test .replaceRight'] = function (assert, util) {
    var node;

    // Not nested
    node = new SourceNode(null, null, null, 'hello world');
    node.replaceRight(/world/, 'universe');
    assert.equal(node.toString(), 'hello universe');

    // Nested
    node = new SourceNode(null, null, null,
                          [new SourceNode(null, null, null, 'hey sexy mama, '),
                           new SourceNode(null, null, null, 'want to kill all humans?')]);
    node.replaceRight(/kill all humans/, 'watch Futurama');
    assert.equal(node.toString(), 'hey sexy mama, want to watch Futurama?');
  };

  exports['test .toStringWithSourceMap()'] = function (assert, util) {
    var node = new SourceNode(null, null, null,
                              ['(function () {\n',
                               '  ', new SourceNode(1, 0, 'a.js', ['someCall()']), ';\n',
                               '  ', new SourceNode(2, 0, 'b.js', ['if (foo) bar()']), ';\n',
                               '}());']);
    var map = node.toStringWithSourceMap({
      file: 'foo.js'
    }).map;

    assert.ok(map instanceof SourceMapGenerator, 'map instanceof SourceMapGenerator');
    map = new SourceMapConsumer(map.toString());

    var actual;

    actual = map.originalPositionFor({
      line: 2,
      column: 2
    });
    assert.equal(actual.source, 'a.js');
    assert.equal(actual.line, 1);
    assert.equal(actual.column, 0);

    actual = map.originalPositionFor({
      line: 3,
      column: 2
    });
    assert.equal(actual.source, 'b.js');
    assert.equal(actual.line, 2);
    assert.equal(actual.column, 0);
  };

});
