# grunt-contrib-mincss [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-mincss.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-mincss)

> Compress CSS files.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-mincss`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-mincss');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file, add a section named `mincss`. This section specifies the files to compress with [clean-css](https://github.com/GoalSmashers/clean-css).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

Note: When the value contains an array of multiple filepaths, the contents are concatenated in the order passed.

#### Config Example

``` javascript
mincss: {
  compress: {
    files: {
      "path/to/output.css": ["path/to/input_one.css", "path/to/input_two.css"]
    }
  }
}

```

--

*Task submitted by [Tim Branyen](https://github.com/tbranyen).*