<h1 align="center">
	<br>
	<br>
	<br>
	<img width="380" src="https://rawgit.com/sindresorhus/hasha/master/media/logo.svg" alt="hasha">
	<br>
	<br>
	<br>
	<br>
	<br>
</h1>

> Hashing made simple. Get the hash of a buffer/string/stream/file.

[![Build Status](https://travis-ci.org/sindresorhus/hasha.svg?branch=master)](https://travis-ci.org/sindresorhus/hasha)

Convenience wrapper around the core [`crypto` Hash class](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) with simpler API and better defaults.


## Install

```
$ npm install --save hasha
```


## Usage

```js
var hasha = require('hasha');

hasha('unicorn');
//=> 'e233b19aabc7d5e53826fb734d1222f1f0444c3a3fc67ff4af370a66e7cadd2cb24009f1bc86f0bed12ca5fcb226145ad10fc5f650f6ef0959f8aadc5a594b27'
```

```js
var hasha = require('hasha');

// hash the process input and output the hash sum
process.stdin.pipe(hasha.stream()).pipe(process.stdout);
```

```js
var hasha = require('hasha');

// get the MD5 hash of an image
hasha.fromFile('unicorn.png', {algorithm: 'md5'}).then(function (hash) {
	console.log(hash);
	//=> '1abcb33beeb811dca15f0ac3e47b88d9'
});
```


## API

See the Node.js [`crypto` docs](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) for more about hashing.

### hasha(input, [options])

Returns a hash.

#### input

Type: `buffer`, `string`, `array` of `string`|`buffer`

Buffer you want to hash.

While strings are supported you should prefer buffers as they're faster to hash. Though if you already have a string you should not convert it to a buffer.

Pass an array instead of concatenating strings and/or buffers. The output is the same, but arrays do not incur the overhead of concatenation.

#### options

##### encoding

Type: `string`  
Default: `hex`  
Values: `hex`, `base64`, `buffer`, `binary`

Encoding of the returned hash.

##### algorithm

Type: `string`  
Default: `sha512`  
Values: `md5`, `sha1`, `sha256`, `sha512`, etc *([platform dependent](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm))*

*The `md5` algorithm is good for [file revving](https://github.com/sindresorhus/rev-hash), but you should never use `md5` or `sha1` for anything sensitive. [They're insecure.](http://googleonlinesecurity.blogspot.no/2014/09/gradually-sunsetting-sha-1.html)*

### hasha.stream([options])

Returns a [hash transform stream](https://nodejs.org/api/crypto.html#crypto_class_hash).

### hasha.fromStream(stream, [options])

Returns a promise that resolves to a hash.

### hasha.fromFile(filepath, [options])

Returns a promise that resolves to a hash.

### hasha.fromFileSync(filepath, [options])

Returns a hash.


## Resources

- [Hasha: A Friendly Crypto API • DailyJS](http://dailyjs.com/2015/06/12/hasha-a-friendly-crypto-api/)


## Related

- [hasha-cli](https://github.com/sindresorhus/hasha-cli) - CLI for this module
- [hash-obj](https://github.com/sindresorhus/hash-obj) - Get the hash of an object


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
