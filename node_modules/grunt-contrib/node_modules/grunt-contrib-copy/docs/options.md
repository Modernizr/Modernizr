##### files ```object```

This defines what files this task will copy and should contain key:value pairs.

The key (destination) should be an unique path (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

As of v0.3.0, when copying to a directory you must add a trailing slash to the destination due to added support of single file copy.

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### basePath ```string```

This option adjusts the folder structure when copied to the destination directory. When not explicitly set, best effort is made to locate the basePath by comparing all source filepaths left to right for a common pattern.

##### flatten ```boolean```

This option performs a flat copy that dumps all the files into the root of the destination directory, overwriting files if they exist.

##### processName ```function```

This option accepts a function that adjusts the filename of the copied file. Function is passed filename and should return a string.

``` javascript
options: {
  processName: function(filename) {
    if (filename == "test.jpg") {
      filename = "newname.jpg";
    }
    return filename;
  }
}
```

##### processContent ```function```

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

##### processContentExclude ```string```

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

##### minimatch ```object```

These options will be forwarded on to expandFiles, as referenced in the [minimatch options section](https://github.com/isaacs/minimatch/#options)