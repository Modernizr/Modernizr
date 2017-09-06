/*global describe, it*/
'use strict';


var assert = require('assert');
var Ruler  = require('../lib/ruler');

describe('Ruler', function () {

  it('should replace rule (.at)', function () {
    var ruler = new Ruler();
    var res = 0;

    ruler.push('test', function foo() { res = 1; });
    ruler.at('test', function bar() { res = 2; });

    var rules = ruler.getRules('');

    assert.strictEqual(rules.length, 1);
    rules[0]();
    assert.strictEqual(res, 2);
  });


  it('should inject before/after rule', function () {
    var ruler = new Ruler();
    var res = 0;

    ruler.push('test', function foo() { res = 1; });
    ruler.before('test', 'before_test', function fooBefore() { res = -10; });
    ruler.after('test', 'after_test', function fooAfter() { res = 10; });

    var rules = ruler.getRules('');

    assert.strictEqual(rules.length, 3);
    rules[0]();
    assert.strictEqual(res, -10);
    rules[1]();
    assert.strictEqual(res, 1);
    rules[2]();
    assert.strictEqual(res, 10);
  });


  it('should enable/disable rule', function () {
    var rules, ruler = new Ruler();

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);

    ruler.disable('test');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
    ruler.disable('test2');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 0);

    ruler.enable('test');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
    ruler.enable('test2');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);
  });


  it('should enable/disable multiple rule', function () {
    var rules, ruler = new Ruler();

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    ruler.disable([ 'test', 'test2' ]);
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 0);
    ruler.enable([ 'test', 'test2' ]);
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);
  });


  it('should enable rules by whitelist', function () {
    var rules, ruler = new Ruler();

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    ruler.enable('test', true);
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
  });


  it('should support multiple chains', function () {
    var rules, ruler = new Ruler();

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {}, { alt: [ 'alt1' ] });
    ruler.push('test2', function bar() {}, { alt: [ 'alt1', 'alt2' ] });

    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 3);
    rules = ruler.getRules('alt1');
    assert.strictEqual(rules.length, 2);
    rules = ruler.getRules('alt2');
    assert.strictEqual(rules.length, 1);
  });


  it('should fail on invalid rule name', function () {
    var ruler = new Ruler();

    ruler.push('test', function foo() {});

    assert.throws(function () {
      ruler.at('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.before('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.after('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.enable('invalid name');
    });
    assert.throws(function () {
      ruler.disable('invalid name');
    });
  });

  it('should always return an array, even when no rules are defined for the rule name', function () {
    var rules, ruler = new Ruler();

    rules = ruler.getRules('list');
    assert.strictEqual(rules.constructor, Array);
  });

});
