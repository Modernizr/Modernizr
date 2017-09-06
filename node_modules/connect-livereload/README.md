
connect-livereload
==================
connect middleware for adding the livereload script to the response.
no browser plugin is needed.
if you are happy with a browser plugin, then you don't need this middleware.

[![NPM](https://nodei.co/npm/connect-livereload.png?downloads=true&downloadRank=true)](https://nodei.co/npm-dl/connect-livereload/)


[![Build Status](https://travis-ci.org/intesso/connect-livereload.png)](https://travis-ci.org/intesso/connect-livereload)
[![Coverage Status](https://coveralls.io/repos/intesso/connect-livereload/badge.svg)](https://coveralls.io/r/intesso/connect-livereload)


install
=======
```bash
npm install connect-livereload --save-dev
```

use
===
note: if you use this middleware, you should make sure to switch off the Browser LiveReload Extension if you have it installed.

this middleware can be used with a LiveReload module e.g. [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) or [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).

`connect-livereload` itself does not serve the `livereload.js` script.

In your connect or express application add this after the static and before the dynamic routes.
If you need liveReload on static html files, then place it before the static routes.
`ignore` gives you the possibility to ignore certain files or url's from being handled by `connect-livereload`.

## connect/express example
```javascript
  app.use(require('connect-livereload')({
    port: 35729
  }));
```

please see the [examples](https://github.com/intesso/connect-livereload/tree/master/examples) for the app and Grunt configuration.

## options
Options are not mandatory: `app.use(require('connect-livereload')());`
The Options have to be provided when the middleware is loaded:

e.g.:
```
  app.use(require('connect-livereload')({
    port: 35729,
    ignore: ['.js', '.svg']
  }));

```

These are the available options with the following defaults:

```javascript
  // `ignore` and `include`: array with strings and regex expressions elements.
  // strings: included/ignored when the url contains this string
  // regex: any expression: e.g. starts with pattern: /^.../ ends with pattern: /...$/
  ignore: [
    /\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/,
    /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/
  ],

  // include all urls by default
  include: [/.*/],

  // this function is used to determine if the content of `res.write` or `res.end` is html.
  html: function (str) {
    if (!str) return false;
    return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
  },

  // rules are provided to find the place where the snippet should be inserted.
  // the main problem is that on the server side it can be tricky to determine if a string will be valid html on the client.
  // the function `fn` of the first `match` is executed like this `body.replace(rule.match, rule.fn);`
  // the function `fn` has got the arguments `fn(w, s)` where `w` is the matches string and `s` is the snippet.
  rules: [{
    match: /<\/body>(?![\s\S]*<\/body>)/i,
    fn: prepend
  }, {
    match: /<\/html>(?![\s\S]*<\/html>)/i,
    fn: prepend
  }, {
    match: /<\!DOCTYPE.+?>/i,
    fn: append
  }],

  // port where the script is loaded
  port: 35729,

  // location where the script is provided (not by connect-livereload). Change this e.g. when serving livereload with a proxy.
  src: "http://localhost:35729/livereload.js?snipver=1",

  // Set this option to `true` to set `req.headers['accept-encoding']` to 'identity' (disabling compression)
  disableCompression: false,
```

please see the [examples](https://github.com/intesso/connect-livereload/tree/master/examples) for the app and Grunt configuration.


## grunt example

The following example is from an actual Gruntfile that uses [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect)

```javascript
connect: {
  options: {
    port: 3000,
    hostname: 'localhost'
  },
  dev: {
    options: {
      middleware: function (connect) {
        return [
          require('connect-livereload')(), // <--- here
          checkForDownload,
          mountFolder(connect, '.tmp'),
          mountFolder(connect, 'app')
        ];
      }
    }
  }
}
```
For use as middleware in grunt simply add the following to the **top** of your array of middleware.

```javascript
  require('connect-livereload')(),
```
You can pass in options to this call if you do not want the defaults.

`dev` is simply the name of the server being used with the task `grunt connect:dev`. The other items in the `middleware` array are all functions that either are of the form `function (req, res, next)` like `checkForDownload` or return that like `mountFolder(connect, 'something')`.

alternative
===========
An alternative would be to install the [LiveReload browser plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).


credits
=======
* The initial middleware code was mainly extracted from: [grunt-contrib-livereload/util.js](https://github.com/gruntjs/grunt-contrib-livereload/blob/master/lib/utils.js)
* [LiveReload Creator](http://livereload.com/)

tests
=====
run the tests with
```
mocha
```

license
=======
[MIT License](https://github.com/intesso/connect-livereload/blob/master/LICENSE)
