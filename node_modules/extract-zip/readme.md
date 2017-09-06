# extract-zip

Unzip written in pure JavaScript. Extracts a zip into a directory. Available as a library or a command line program.

Uses the [`yauzl`](http://npmjs.org/yauzl) ZIP parser.

[![NPM](https://nodei.co/npm/extract-zip.png?global=true)](https://nodei.co/npm/extract-zip/)
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

Get the library:

```
npm install extract-zip --save
```

Install the command line program:

```
npm install extract-zip -g
```

## JS API

```js
var extract = require('extract-zip')
extract(source, {dir: target}, function (err) {
 // extraction is complete. make sure to handle the err
})
```

### Options

- `dir` - defaults to `process.cwd()`
- `defaultDirMode` - integer - Directory Mode (permissions) will default to `493` (octal `0755` in integer)
- `defaultFileMode` - integer - File Mode (permissions) will default to `420` (octal `0644` in integer)
- `onEntry` - function - if present, will be called with every entry from the zip file. forwarded from the `entry` event from yauzl.

Default modes are only used if no permissions are set in the zip file.

## CLI Usage

```
extract-zip foo.zip <targetDirectory>
```

If not specified, `targetDirectory` will default to `process.cwd()`.
