# grunt-contrib-stylus [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-stylus.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-stylus)

> Compile Stylus files to CSS.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-stylus`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-stylus');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file add a section named `stylus`. This section specifies the files to compile and the options passed to [stylus](http://learnboost.github.com/stylus/).

This task comes preloaded with [nib](http://visionmedia.github.com/nib/).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, you can use *.{ext} as your destination filename to individually compile each file to the destination directory. Otherwise, when the source contains an array of multiple filepaths, the contents are concatenated in the order passed.

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

##### basePath ```string``` (individual only)

This option adjusts the folder structure when compiled to the destination directory. When not explicitly set, best effort is made to locate the basePath by comparing all source filepaths left to right for a common pattern.

##### compress ```boolean```

This option specifies if we should compress the compiled css.

##### flatten ```boolean``` (individual only)

This option performs a flat compile that dumps all the files into the root of the destination directory, overwriting files if they exist.

##### paths ```string|array```

This option specifies directories to scan for @import directives when parsing.

#### Config Example

``` javascript
stylus: {
  compile: {
    options: {
      compress: true,
      paths: ['path/to/import', 'another/to/import']
    },
    files: {
      'path/to/result.css': 'path/to/source.styl', // 1:1 compile
      'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.style'], // compile and concat into single file
      'path/to/*.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile individually into dest, maintaining folder structure
    }
  },
  flatten: {
    options: {
      flatten: true,
      paths: ['path/to/import', 'another/to/import']
    },
    files: {
      'path/to/*.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile individually into dest, flattening folder structure
    }
  }
}
```

--

*Task submitted by [Eric Woroshow](https://github.com/errcw).*