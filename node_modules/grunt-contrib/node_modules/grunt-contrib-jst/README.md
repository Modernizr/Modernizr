# grunt-contrib-jst [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-jst.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-jst)

> Compile underscore templates to JST file.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-jst`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-jst');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

### Overview

This task compiles Underscore compatible templates into functions that can be concatenated and minified with existing source files.

Inside your `grunt.js` file, add a section named `jst`. This section specifies the files to compile and the options passed to [underscore.template](http://underscorejs.org/#template).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

Note: Values are precompiled to the namespaced JST array in the order passed.

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

##### namespace ```string```

The namespace in which the precompiled templates will be asssigned (default is JST).  *Use dot notation (e.g. App.Templates) for nested namespaces.*

Example:
``` javascript
options: {
  namespace: 'JST'
}
```

##### processName ```function```

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default JST namespace in capital letters.

``` javascript
options: {
  processName: function(filename) {
    return filename.toUpperCase();
  }
}
```

##### templateSettings ```object```

The settings passed to underscore when compiling templates.

#### Config Examples

``` javascript
jst: {
  compile: {
    options: {
      templateSettings: {
        interpolate : /\{\{(.+?)\}\}/g
      }
    },
    files: {
      "path/to/compiled/templates.js": ["path/to/source/**/*.html"]
    }
  }
}
```

--

*Task submitted by [Tim Branyen](http://github.com/tbranyen).*