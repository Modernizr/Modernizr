# fill-keys [![Build Status](https://travis-ci.org/bendrucker/fill-keys.svg?branch=master)](https://travis-ci.org/bendrucker/fill-keys)

> Fill keys in a destination that are defined on the source. Copies descriptors so properties like `enumerable` will persist. 


## Install

```
$ npm install --save fill-keys
```


## Usage

```js
var fillKeys = require('fill-keys');

fillKeys(destination, source);
//=> missing destination keys in source are copied
```

fill-keys will copy descriptors. It will also copy the `source.prototype` properties onto `destination.prototype` if both `destination` and `source` are functions. 

## API

#### `fillKeys(destination, source)` -> `destination`

#### `destination`

*Required*  
Type: `any`

The destination object where keys from `source` will be added.

#### source

*Required*  
Type: `any`

The source object from which to copy properties.

#### `fillKeys.es3(destination, source)` -> `destination`

An ES3-compatible version of `fillKeys`. Behavior is identical but simple assignment is used instead of `Object.defineProperty`.


## License

MIT © [Ben Drucker](http://bendrucker.me)
