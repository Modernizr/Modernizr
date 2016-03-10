/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var assert = require('assert');
var Symbol = require('./');

var s1 = Symbol();
var s2 = Symbol();
var o = {};

o[s1] = "foo";
o[s2] = "bar";

assert.equal(o[s1], 'foo', 'can get and set property');
assert.equal(o[s2], 'bar', 'can get and set property');
assert.equal(Object.keys(o).indexOf(String(s1)), -1, 'symbol not enumerable');

var s3 = Symbol.for('baz');
var s4 = Symbol.for('baz');
var s5 = Symbol.for('quux');
assert.equal(s3, s4, 'Symbol.for returns the same Symbols for same keys');
assert.notEqual(s4, s5, 'Symbol.for returns different Symbols for different keys');

var s6 = Symbol('someKey');
var s7 = Symbol.for('someKey');

assert.notEqual(s6, s7, 'Symbols not automatically registered if .for() not used');

var key = Symbol.keyFor(s7);
assert.equal(key, 'someKey');

assert.notEqual(Symbol.keyFor(s6), 'someKey');
assert.equal(Symbol.keyFor(s6), undefined);

assert.throws(function() {
  Symbol.keyFor('notSymbol');
});
