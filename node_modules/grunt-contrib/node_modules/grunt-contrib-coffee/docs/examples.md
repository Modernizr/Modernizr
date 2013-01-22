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