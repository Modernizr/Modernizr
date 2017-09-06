# etag

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Create simple HTTP ETags

This module generates HTTP ETags (as defined in RFC 7232) for use in
HTTP responses.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install etag
```

## API

<!-- eslint-disable no-unused-vars --> 

```js
var etag = require('etag')
```

### etag(entity, [options])

Generate a strong ETag for the given entity. This should be the complete
body of the entity. Strings, `Buffer`s, and `fs.Stats` are accepted. By
default, a strong ETag is generated except for `fs.Stats`, which will
generate a weak ETag (this can be overwritten by `options.weak`).

<!-- eslint-disable no-undef --> 

```js
res.setHeader('ETag', etag(body))
```

#### Options

`etag` accepts these properties in the options object.

##### weak

Specifies if the generated ETag will include the weak validator mark (that
is, the leading `W/`). The actual entity tag is the same. The default value
is `false`, unless the `entity` is `fs.Stats`, in which case it is `true`.

## Testing

```sh
$ npm test
```

## Benchmark

```bash
$ npm run-script bench

> etag@1.8.0 bench nodejs-etag
> node benchmark/index.js

  http_parser@2.7.0
  node@6.9.1
  v8@5.1.281.84
  uv@1.9.1
  zlib@1.2.8
  ares@1.10.1-DEV
  icu@57.1
  modules@48
  openssl@1.0.2j

> node benchmark/body0-100b.js

  100B body

  4 tests completed.

* buffer - strong x 498,600 ops/sec ±0.82% (191 runs sampled)
* buffer - weak   x 496,249 ops/sec ±0.59% (179 runs sampled)
  string - strong x 466,298 ops/sec ±0.88% (186 runs sampled)
  string - weak   x 464,298 ops/sec ±0.84% (184 runs sampled)

> node benchmark/body1-1kb.js

  1KB body

  4 tests completed.

* buffer - strong x 346,535 ops/sec ±0.32% (189 runs sampled)
* buffer - weak   x 344,958 ops/sec ±0.52% (185 runs sampled)
  string - strong x 259,672 ops/sec ±0.82% (191 runs sampled)
  string - weak   x 260,931 ops/sec ±0.76% (190 runs sampled)

> node benchmark/body2-5kb.js

  5KB body

  4 tests completed.

* buffer - strong x 136,510 ops/sec ±0.62% (189 runs sampled)
* buffer - weak   x 136,604 ops/sec ±0.51% (191 runs sampled)
  string - strong x  80,903 ops/sec ±0.84% (192 runs sampled)
  string - weak   x  82,785 ops/sec ±0.50% (193 runs sampled)

> node benchmark/body3-10kb.js

  10KB body

  4 tests completed.

* buffer - strong x 78,650 ops/sec ±0.31% (193 runs sampled)
* buffer - weak   x 78,685 ops/sec ±0.41% (193 runs sampled)
  string - strong x 43,999 ops/sec ±0.43% (193 runs sampled)
  string - weak   x 44,081 ops/sec ±0.45% (192 runs sampled)

> node benchmark/body4-100kb.js

  100KB body

  4 tests completed.

  buffer - strong x 8,860 ops/sec ±0.66% (191 runs sampled)
* buffer - weak   x 9,030 ops/sec ±0.26% (193 runs sampled)
  string - strong x 4,838 ops/sec ±0.16% (194 runs sampled)
  string - weak   x 4,800 ops/sec ±0.52% (192 runs sampled)

> node benchmark/stats.js

  stat

  4 tests completed.

* real - strong x 1,468,073 ops/sec ±0.32% (191 runs sampled)
* real - weak   x 1,446,852 ops/sec ±0.64% (190 runs sampled)
  fake - strong x   635,707 ops/sec ±0.33% (194 runs sampled)
  fake - weak   x   627,708 ops/sec ±0.36% (192 runs sampled)
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/etag.svg
[npm-url]: https://npmjs.org/package/etag
[node-version-image]: https://img.shields.io/node/v/etag.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://img.shields.io/travis/jshttp/etag/master.svg
[travis-url]: https://travis-ci.org/jshttp/etag
[coveralls-image]: https://img.shields.io/coveralls/jshttp/etag/master.svg
[coveralls-url]: https://coveralls.io/r/jshttp/etag?branch=master
[downloads-image]: https://img.shields.io/npm/dm/etag.svg
[downloads-url]: https://npmjs.org/package/etag
