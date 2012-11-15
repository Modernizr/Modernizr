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