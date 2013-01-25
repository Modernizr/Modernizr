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
