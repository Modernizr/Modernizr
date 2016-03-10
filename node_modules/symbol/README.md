# Symbols

[![NPM version](https://badge.fury.io/js/symbol.png)](http://badge.fury.io/js/symbol)

[ES6 Symbols](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-symbol-objects), in your ES5.

If `Symbol` is already defined, it will be used. Otherwise, this implements as much of the `Symbol` spec as is possible with plain JavaScript.

## Usage

```js
var Symbol = require('symbol');
var key = Symbol();

var obj = {};
obj[key] = 'foo';
console.log(obj[key]); // 'foo'
console.log(Object.keys(obj)); // []
```
