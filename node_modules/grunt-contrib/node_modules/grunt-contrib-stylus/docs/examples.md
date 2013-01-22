```js
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