# grunt-contrib-requirejs [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-requirejs.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-requirejs)

> Optimize RequireJS projects using r.js.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-requirejs`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-requirejs');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file add a section named `requirejs`. This section specifies the options passed to [RequireJS Optimizer](http://requirejs.org/docs/optimization.html).

#### Parameters

##### options ```object```

This controls how this task (and its helpers) operate and should contain key:value pairs, see options below.

#### Options

For a full list of possible options, [see the r.js example build file](https://github.com/jrburke/r.js/blob/master/build/example.build.js).

#### Config Example

``` javascript
requirejs: {
  compile: {
    options: {
      baseUrl: "path/to/base",
      mainConfigFile: "path/to/config.js",
      out: "path/to/optimized.js"
    }
  }
}
```

--

*Task submitted by [Tyler Kellen](http://goingslowly.com/).*