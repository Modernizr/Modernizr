# Modernizr [![Build Status](https://secure.travis-ci.org/Modernizr/Modernizr.png?branch=master)](http://travis-ci.org/Modernizr/Modernizr)

**Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.**

- [Website](http://www.modernizr.com)
- [Documentation](http://www.modernizr.com/docs/)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages based on whether the user's browser supports a particular feature or API. To see the output of all the tests Modernizr can run, visit the [test suite](http://modernizr.github.io/Modernizr/test/).

Modernizr has an optional (*not included*) conditional resource loader called `Modernizr.load()`, based on [Yepnope.js](http://yepnopejs.com). You can build a custom Modernizr file that includes `Modernizr.load()`, as well as choosing which feature tests to include on the [download page](http://www.modernizr.com/download/).

## Use in a node.js project

Often times people want to know when an asynchronous test is done so they can allow their application to react to it.
In the past, you've had to rely on watching properties or `<html>` classes. Only events on **asynchronous** tests are
supported. Synchronous tests should be handled synchronously for improved speed and to maintain consistency.

<!-- Note: this step is not valid until Modernizr is registered with NPM -->

1. Install the package locally: `npm install --save modernizr`
2. Require and use in your node project.

#### modernizr.build(config[, options], callback)

The `build()` method creates a custom build of Modernizer and exposes it as a string in a callback.

**config** `Object`, required

A Modernizr configuration object. See [`lib/config-all.json`](lib/config-all.json) for all available options.

**options** `Object`

- **min** `Boolean`  
    Minify the output code. Defaults to false.
- **verbose** `Boolean`  
    Output success messages. Defaults to false.
    
**callback** `Function`, required

Function to run when the Modernizr build is completed. An `output` argument containing the custom build is available for writing to the filesystem.
    
#### Example

```js
'use strict';
var modernizr = require('modernizr');
var config = require('my-config.json');

modernizr.build(config, {
  min: true,
  verbose: false,
  callback: function (output) {
    fs.writeFileSync('./modernizr-build', output);
  },
});
```

#### modernizr.metadata(callback)

Generates JSON metadata for the Modernizr project, available in a callback.

**callback** `Function`, required

Function to run when JSON generation is complete. An `output` argument containing the JSON as a string is available for writing to the filesystem.

#### Example

```js
'use strict';
var modernizr = require('modernizr');

modernizr.metadata(function (output) {
    fs.writeFileSync('./modernizr-metadata.json', output);
  },
});
```

## Use from the command line

You can also use the package manually from the command line.

1. Install the package globally: `npm install -g modernizr`
2. Run `modernizr` from the command line.

`--config, -c`: Path to a JSON file containing Modernizr configuration. See lib/config-all.json for an example. If you don't provide a configuration file Modernizr will output a development build with all feature detects.

`--metadata, -m`: Output Modernizr project metadata as a JSON file.

`--dest, -d`: Path to write the build or metadata file to. Defaults to ./modernizr.js for a Modernizr build, or ./metadata.json when used with `--metadata`.

`--uglify, -u`: Minify/uglify the output file.

`--quiet, -q`: Don't show confirmation output.

`--help, -h`: Show help.

#### Example

```bash
# Generate a development build to ./modernizr.js
$ modernizr

# Generate a custom minified build at a specified location
$ modernizr --config ./my-config.json --dest ./build/modernizr-build.js --uglify --verbose

# Generate Modernizr project metadata at a specified location
$ modernizr --metadata --dest ./Modernizr-metadata.json
```

## Use with Grunt

Check out [Grunt-modernizr](https://github.com/Modernizr/grunt-modernizr)!

## Contributing

Add and improve feature tests in `feature-detects/`.  
Contribute to the Modernizr script in `src/`.  
Contribute to the build system in `lib/`.  

Take care to maintain the existing code style. Lint and test your code with Grunt.  
To contribute to the the web-based build tool, see the [modernizr.com repository](https://github.com/Modernizr/modernizr.com/).  

#### Testing

To test in phantom, run `grunt test`.  
To test in the browser:

1. run `grunt build`
2. run `serve .`
3. visit `<url>/test`

## License

[MIT license](http://en.wikipedia.org/wiki/MIT_License)
