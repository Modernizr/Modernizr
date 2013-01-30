# grunt-contrib-coffee [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-coffee.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-coffee)

> Compile CoffeeScript files to JavaScript.

### Overview

Inside your `grunt.js` file add a section named `coffee`. This section specifies the files to compile and the options passed to [CoffeeScript](http://coffeescript.org/#usage).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, you can use *.{ext} as your destination filename to individually compile each file to the destination directory. Otherwise, when the source contains an array of multiple filepaths, the contents are concatenated in the order passed.

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

##### bare ```boolean```

Compile the JavaScript without the top-level function safety wrapper.

##### basePath ```string``` (individual only)

This option adjusts the folder structure when compiled to the destination directory. When not explicitly set, best effort is made to locate the basePath by comparing all source filepaths left to right for a common pattern.

##### flatten ```boolean``` (individual only)

This option performs a flat compile that dumps all the files into the root of the destination directory, overwriting files if they exist.

#### Config Example

``` javascript
coffee: {
  compile: {
    files: {
      'path/to/result.js': 'path/to/source.coffee', // 1:1 compile
      'path/to/another.js': ['path/to/sources/*.coffee', 'path/to/more/*.coffee'], // compile and concat into single file
      'path/to/*.js': ['path/to/sources/*.coffee', 'path/to/more/*.coffee'] // compile individually into dest, maintaining folder structure
      }
    },
    flatten: {
      options: {
        flatten: true
      },
      files: {
        'path/to/*.js': ['path/to/sources/*.coffee', 'path/to/more/*.coffee'] // compile individually into dest, flattening folder structure
      }
    }
}
```

--

*Task submitted by [Eric Woroshow](https://github.com/errcw).*