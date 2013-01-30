##### files ```object```

This defines what files this task will process and should contain key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/blob/master/docs/api_template.md)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)).

Note: Values are precompiled to the namespaced JST array in the order passed.

##### options ```object```

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### namespace ```string```

The namespace in which the precompiled templates will be assigned (default is JST).  *Use dot notation (e.g. App.Templates) for nested namespaces.*

Example:
```js
options: {
  namespace: 'MyApp.Templates'
}
```

##### wrapped ```boolean```

Determine if preprocessed template functions will be wrapped in Handlebars.template function (default is false).

##### processName ```function```

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default JST namespace in capital letters.

```js
options: {
  processName: function(filename) {
    return filename.toUpperCase();
  }
}
```

##### processPartialName ```function```

This option accepts a function which takes one argument (the partial filepath) and returns a string which will be used as the key for the precompiled partial object when it is registered in Handlebars.partials. The example below stores all partials using only the actual filename instead of the full path.

```js
options: {
  processPartialName: function(filePath) { // input:  templates/_header.hbs
    var pieces = filePath.split("/");
    return pieces[pieces.length - 1];      // output: _header.hbs
  }
}
````

Note: If processPartialName is not provided as an option the default assumes that partials will be stored by stripping trailing underscore characters and filename extensions. For example, the path *templates/_header.hbs* will become *header* and can be referenced in other templates as *{{> header}}*.

##### partialRegex ```regex```

This option accepts a regex that defines the prefix character that is used to identify Handlebars partial files. (The default is _).

``` javascript
options: {
  partialRegex: /^par_/ // assumes partial files would be prefixed with "par_" ie: "par_header.hbs"
}
```
