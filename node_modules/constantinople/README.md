# constantinople

Determine whether a JavaScript expression evaluates to a constant (using acorn).  Here it is assumed to be safe to underestimate how constant something is.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/constantinople/master.svg)](https://travis-ci.org/ForbesLindesay/constantinople)
[![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/constantinople.svg)](https://gemnasium.com/ForbesLindesay/constantinople)
[![NPM version](https://img.shields.io/npm/v/constantinople.svg)](https://www.npmjs.org/package/constantinople)

## Installation

    npm install constantinople

## Usage

```js
var isConstant = require('constantinople')

if (isConstant('"foo" + 5')) {
  console.dir(isConstant.toConstant('"foo" + 5'))
}
if (isConstant('Math.floor(10.5)', {Math: Math})) {
  console.dir(isConstant.toConstant('Math.floor(10.5)', {Math: Math}))
}
```

## API

### isConstant(src, [constants])

Returns `true` if `src` evaluates to a constant, `false` otherwise.  It will also return `false` if there is a syntax error, which makes it safe to use on potentially ES6 code.

Constants is an object mapping strings to values, where those values should be treated as constants.  Note that this makes it a pretty bad idea to have `Math` in there if the user might make use of `Math.random` and a pretty bad idea to have `Date` in there.

### toConstant(src, [constants])

Returns the value resulting from evaluating `src`.  This method throws an error if the expression is not constant.  e.g. `toConstant("Math.random()")` would throw an error.

Constants is an object mapping strings to values, where those values should be treated as constants.  Note that this makes it a pretty bad idea to have `Math` in there if the user might make use of `Math.random` and a pretty bad idea to have `Date` in there.

## License

  MIT
