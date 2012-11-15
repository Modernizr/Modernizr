```js
jade: {
  compile: {
    options: {
      data: {
        debug: false
      }
    },
    files: {
      "path/to/dest.html": ["path/to/templates/*.jade", "another/path/tmpl.jade"]
    }
  }
}
```

If you want to generate a debug file and a release file from the same template:

```js
jade: {
  debug: {
    options: {
      data: {
        debug: true
      }
    },
    files: {
      "debug.html": "test.jade"
    }
  },
  release: {
    options: {
      data: {
        debug: false
      }
    },
    files: {
      "release.html": "test.jade"
    }
  }
}
```

If you want to use `grunt` template in `options.data`:

```js
jade: {
  debug: {
    options: {
      data: {
        debug: true,
        timestamp: "<%= new Date().getTime() %>"
      }
    },
    files: {
      "debug.html": "test.jade"
    }
  }
}
```

or you can use `grunt` helpers (grunt object was exposed at template context):

```js
jade: {
  debug: {
    options: {
      data: {
        debug: true,
        timestamp: "<%= grunt.template.today() %>"
      }
    },
    files: {
      "debug.html": "test.jade"
    }
  }
}
```