# module-not-found-error [![Build Status](https://travis-ci.org/bendrucker/module-not-found-error.svg?branch=master)](https://travis-ci.org/bendrucker/module-not-found-error)

> Create a module not found error

## Install

```
$ npm install --save module-not-found-error
```

## Usage

```js
var moduleNotFoundError = require('module-not-found-error')

var err = moduleNotFoundError('foo')
//=> err.message: Cannot find module 'foo'
//=> err.code: 'MODULE_NOT_FOUND'
```

## API

#### `moduleNotFoundError(id)` -> `err`

Returns an error with the appropriate message and code.

#### `id`

*Required*  
Type: `string`

A module name or path passed to `require`.

## License

MIT © [Ben Drucker](http://bendrucker.me)
