# grunt-contrib-compress [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-compress.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-compress)

> Compress files and folders.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-compress`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-compress');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file, add a section named `compress`. This section specifies the files to compress and the options passed to either [zipstream](https://github.com/wellawaretech/node-zipstream) (for zip) or [tar](https://github.com/isaacs/node-tar) (for tar/tgz) or [zlib](http://nodejs.org/api/zlib.html#zlib_options) (for gzip).

#### Parameters

##### files ```object```

This defines what files this task will compress and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### mode ```string```

This is used to define which mode to use, currently supports gzip, tar, tgz (tar gzip) and zip.

As of v0.3.0, this is now automatically detected per dest:src pair but can be overridden per target if desired.

##### basePath ```string```

This option adjusts internal filenames to be relative to provided path, within the resulting archive file.

This has been automatically detected per dest:src pair for some time now but can be overridden per target if desired.

##### flatten ```boolean```

This option performs a flat copy that dumps all the files into the root of the destination file, overwriting files if they exist.

##### level ```integer``` (zip only)

This option sets the level of archive compression (defaults to 1).

> Currently, gzip compression related options are not supported due to deficiencies in node's zlib library.

##### rootDir ```string```

This option allows the creation of a root folder to contain files within the resulting archive file.

#### Config Example

``` javascript
compress: {
  zip: {
    files: {
      "path/to/result.zip": "path/to/source/*", // includes files in dir
      "path/to/another.tar": "path/to/source/**", // includes files in dir and subdirs
      "path/to/final.tgz": ["path/to/sources/*.js", "path/to/more/*.js"], // include JS files in two diff dirs
      "path/to/single.gz": "path/to/source/single.js", // gzip a single file
      "path/to/project-<%= pkg.version %>.zip": "path/to/source/**" // variables in destination
    }
  }
}
```

--

*Task submitted by [Chris Talkington](https://github.com/ctalkington).*