# Modernizr [![Build Status](https://secure.travis-ci.org/Modernizr/Modernizr.png?branch=master)](http://travis-ci.org/Modernizr/Modernizr)

##### Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.

- [Website](http://www.modernizr.com)
- [Documentation](http://www.modernizr.com/docs/)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages with a granular level of control over the experience.

Modernizr has an optional (*not included*) conditional resource loader called `Modernizr.load()`, based on [Yepnope.js](http://yepnopejs.com). You can get a build that includes `Modernizr.load()`, as well as choosing which feature tests to include on the [Download page](http://www.modernizr.com/download/).


## Test suite

Run the [test suite](http://modernizr.github.com/Modernizr/test/)


## Building Modernizr v3

### To generate everything in 'config-all.json':

```js
grunt build
//outputs to ./dist/modernizr-build.js
```

### To run tests (in phantom):

```js
grunt qunit
```

### To run tests (in browser):

```shell
grunt build
serve .
visit <url>/tests
```

### To see simple build in browser:

serve the root dir, `<url>/test/modular.html`


### To see the build tool:


* checkout the modernizr.com code
* install all your gems and bundles and jekyll and shit
* `jekyll`
* `serve ./_sites`
* visit <url>/download
* It should be just a big list of things you can build with no frills.


## License

MIT license
