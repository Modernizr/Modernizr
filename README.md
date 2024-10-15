<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- Read this file in Portuguese-BR [here](/README.pt_br.md)
- Read this file in Indonesian [here](/README.id.md)
- Read this file in Spanish [here](/README.sp.md)
- Read this file in Swedish [here](/README.sv.md)
- Read this file in Tamil [here](/README.ta.md)
- Read this file in Kannada [here](/README.ka.md)
- Read this file in Hindi [here](/README.hi.md)

- Our Website is outdated and broken, please DO NOT use it (https://modernizr.com) but rather build your modernizr version from npm.
- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages with a granular level of control over the experience.

## Breaking changes with v4

- Dropped support for node versions <= 10, please upgrade to at least version 12

- Following tests got renamed:

  - `class` to `es6class` to keep in line with the rest of the es-tests

- Following tests got moved in subdirectories:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` moved into the storage subdirectory
  - `audio` moved into the audio subdirectory
  - `battery` moved into the battery subdirectory
  - `canvas`, `canvastext` moved into the canvas subdirectory
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` moved into the event subdirectory
  - `exiforientation` moved into the image subdirectory
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` moved into the input subdirectory
  - `svg` moved into the svg subdirectory
  - `webgl` moved into the webgl subdirectory

- Following tests got removed:

  - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: duplicate of the es6 detect `stringtemplate`
  - `contains`: duplicate of the es6 detect `es6string`
  - `datalistelem`: A dupe of Modernizr.input.list

## New Asynchronous Event Listeners

Often times people want to know when an asynchronous test is done so they can allow their application to react to it.
In the past, you've had to rely on watching properties or `<html>` classes. Only events on **asynchronous** tests are
supported. Synchronous tests should be handled synchronously to improve speed and to maintain consistency.

The new API looks like this:

```js
// Listen to a test, give it a callback
Modernizr.on("testname", function (result) {
  if (result) {
    console.log("The test passed!");
  } else {
    console.log("The test failed!");
  }
});
```

We guarantee that we'll only invoke your function once (per time that you call `on`). We are currently not exposing
a method for exposing the `trigger` functionality. Instead, if you'd like to have control over async tests, use the
`src/addTest` feature, and any test that you set will automatically expose and trigger the `on` functionality.

## Getting Started

- Clone or download the repository
- Install project dependencies with `npm install`

## Building Modernizr

### From javascript

Modernizr can be used programmatically via npm:

```js
var modernizr = require("modernizr");
```

A `build` method is exposed for generating custom Modernizr builds. Example:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

The first parameter takes a JSON object of options and feature-detects to include. See [`lib/config-all.json`](lib/config-all.json) for all available options.

The second parameter is a function invoked on task completion.

### From the command-line

We also provide a command line interface for building modernizr.
To see all available options run:

```shell
./bin/modernizr
```

Or to generate everything in 'config-all.json' run this with npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

To execute the tests using mocha-headless-chrome on the console run:

```shell
npm test
```

You can also run tests in your browser of choice with this command:

```shell
npm run serve-gh-pages
```

and navigate to these two URLs:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Integrating Modernizr with Build Tools

This section provides guidance on how to integrate Modernizr with various build tools and frameworks, making it easier to use in your projects.

### 1. Integrating with Webpack

To integrate Modernizr with Webpack, follow these steps:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save
   ```

2. **Create a Modernizr Configuration File**:
   Create a file named `modernizr-config.js` in your project root:
   ```javascript
   module.exports = {
     "feature-detects": [
       "test/feature1",
       "test/feature2",
       // Add more feature detects as needed
     ]
   };
   ```

3. **Update Webpack Configuration**:
   Modify your Webpack configuration file (e.g., `webpack.config.js`) to include the Modernizr plugin:
   ```javascript
   const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

   module.exports = {
     // Other configurations...
     plugins: [
       new ModernizrWebpackPlugin({
         "feature-detects": [
           "test/feature1",
           "test/feature2"
         ]
       })
     ]
   };
   ```

4. **Build Your Project**:
   Run your Webpack build process:
   ```bash
   npm run build
   ```

### 2. Integrating with Gulp

If you are using Gulp, you can integrate Modernizr as follows:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save-dev
   ```

2. **Create a Gulp Task**:
   In your `gulpfile.js`, add a task to build Modernizr:
   ```javascript
   const gulp = require('gulp');
   const modernizr = require('modernizr');

   gulp.task('modernizr', function() {
     return modernizr.build({
       "feature-detects": [
         "test/feature1",
         "test/feature2"
       ]
     }).pipe(gulp.dest('dist/'));
   });
   ```

3. **Run the Gulp Task**:
   Execute the task to generate the Modernizr build:
   ```bash
   gulp modernizr
   ```

### 3. Integrating with Parcel

For projects using Parcel, you can integrate Modernizr as follows:

1. **Install Modernizr**:
   ```bash
   npm install modernizr --save
   ```

2. **Create a Modernizr Configuration File**:
   Similar to the Webpack setup, create a `modernizr-config.js` file:
   ```javascript
   module.exports = {
     "feature-detects": [
       "test/feature1",
       "test/feature2"
     ]
   };
   ```

3. **Update Parcel Configuration**:
   You can use a plugin like `parcel-plugin-modernizr` to integrate Modernizr:
   ```bash
   npm install parcel-plugin-modernizr --save-dev
   ```

4. **Build Your Project**:
   Run Parcel to build your project:
   ```bash
   parcel build index.html
   ```

### Conclusion

Integrating Modernizr with your build tools can enhance your web applications by allowing you to detect and respond to the capabilities of the user's browser. Follow the steps above to set up Modernizr with your preferred build tool.

For more information, refer to the [Modernizr documentation](https://modernizr.com/docs/).

## Code of Conduct

This project adheres to the [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md).
By participating, you are expected to honor this code.

## License

[MIT License](https://opensource.org/licenses/MIT)
