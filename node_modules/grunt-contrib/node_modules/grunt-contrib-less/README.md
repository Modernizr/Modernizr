# grunt-contrib-less [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-less.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-less)

> Compile LESS files to CSS.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-less`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-less');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file add a section named `less`. This section specifies the files to compile and the options passed to [LESS](http://lesscss.org/#-server-side-usage).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, you can use *.{ext} as your destination filename to individually compile each file to the destination directory. Otherwise, when the source contains an array of multiple filepaths, the contents are concatenated in the order passed.

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

##### paths ```string|array```

This specifies directories to scan for @import directives when parsing. Default value is the directory of the source, which is probably what you want.

##### compress ```boolean```

If set to `true`, the generated CSS will be minified.

##### yuicompress ```boolean```

If set to `true`, the generated CSS will be minified with [YUI Compressor's CSS minifier](http://developer.yahoo.com/yui/compressor/css.html).

#### Config Example

``` javascript
less: {
  development: {
    options: {
      paths: ["assets/css"]
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  },
  production: {
    options: {
      paths: ["assets/css"],
      yuicompress: true
    },
    files: {
      "path/to/result.css": "path/to/source.less"
    }
  }
}
```
--

*Task submitted by [Tyler Kellen](http://goingslowly.com/).*