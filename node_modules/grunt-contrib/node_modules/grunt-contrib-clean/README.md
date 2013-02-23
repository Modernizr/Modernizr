# grunt-contrib-clean
> Clear files and folders (part of the [grunt-contrib](/gruntjs/grunt-contrib) collection).  Submitted by [Tim Branyen](/tbranyen).

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-clean`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib-clean');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

### Overview

Inside your `grunt.js` file, add a section named `clean`.

*Due to the destructive nature of this task, always be cautious of the paths you clean.*

### Config Examples

There are three formats you can use to run this task.

##### Short

``` javascript
clean: ["path/to/dir/one", "path/to/dir/two"]
```

##### Medium (specific targets with global options)

``` javascript
clean: {
  build: ["path/to/dir/one", "path/to/dir/two"],
  release: ["path/to/another/dir/one", "path/to/another/dir/two"]
},
```

##### Long (specific targets with per target options)

``` javascript
clean: {
  build: {
    src: ["path/to/dir/one", "path/to/dir/two"]
  }
}
```

#### Parameters

##### src ```string```

This defines what paths this task will clean recursively (supports [grunt.template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md) and [minimatch](https://github.com/isaacs/minimatch)).