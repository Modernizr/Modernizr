# grunt-contrib

A collection of general use grunt tasks. All tasks are designed with cross platform support in mind and dependencies that can easily be managed through npm.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-contrib');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Included Tasks
#### [`bump`](https://github.com/gruntjs/grunt-contrib-bump/) (not released)
Bump package version.

#### [`clean`](https://github.com/gruntjs/grunt-contrib-clean/)
Clear files and folders.

#### [`coffee`](https://github.com/gruntjs/grunt-contrib-coffee/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-coffee.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-coffee)
Compile CoffeeScript files into JavaScript.

#### [`compress`](https://github.com/gruntjs/grunt-contrib-compress/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-compress.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-compress)
Compress files and folders using gzip or zip.

#### [`copy`](https://github.com/gruntjs/grunt-contrib-copy/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-copy.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-copy)
Copy files into another directory.

#### [`handlebars`](https://github.com/gruntjs/grunt-contrib-handlebars/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-handlebars.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-handlebars)
Compile handlebars templates to JST file.

#### [`jade`](https://github.com/gruntjs/grunt-contrib-jade/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-jade.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-jade)
Compile Jade templates to HTML.

#### [`jst`](https://github.com/gruntjs/grunt-contrib-jst/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-jst.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-jst)
Compile underscore templates to JST file.

#### [`less`](https://github.com/gruntjs/grunt-contrib-less/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-less.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-less)
Compile LESS files to CSS.

#### [`mincss`](https://github.com/gruntjs/grunt-contrib-mincss/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-mincss.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-mincss)
Minify CSS files.

#### [`requirejs`](https://github.com/gruntjs/grunt-contrib-requirejs/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-requirejs.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-requirejs)
Optimize RequireJS projects using r.js.

#### [`stylus`](https://github.com/gruntjs/grunt-contrib-stylus/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-stylus.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-stylus)
Compile Stylus files into CSS. Preloaded with [nib](http://visionmedia.github.com/nib/).

#### [`yuidoc`](https://github.com/gruntjs/grunt-contrib-yuidoc/) [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-contrib-yuidoc.png?branch=master)](http://travis-ci.org/gruntjs/grunt-contrib-yuidoc)
Compile YUIDoc Documentation.

## Bugs

Help us squash them by submitting an issue that describes how you encountered it; please be as specific as possible including operating system, node, grunt, and grunt-contrib versions.

## Contributing

#### Checklist

1. Ensure your task meets the submission guidelines.
2. Ensure your task follows the code style guide.
3. Submit your pull request against `master`, unless otherwise instructed.
4. Ensure your pull request only touches what your changing and that it's squashed (ie `git rebase`).

#### Submission Guidelines

* task should work out of box, cross platform, with a simple `npm install`
* task should fill a general need and ideally be pure JavaScript
* task should include tests that cover, at minimal, its basic features
* task should be linted by running `grunt` at root of project
* task should use any built-in helpers first for consistency

#### Code Style Guide

* code should be indented with 2 spaces
* single quotes should be used where feasible
* commas should be followed by a single space (function params, etc)
* variable declaration should include `var`, [no multiple declarations](http://benalman.com/news/2012/05/multiple-var-statements-javascript/)

#### Tests

* tests should be added to the config in `test/grunt.js`
* see existing tests for guidance

*Currently, testing with grunt is a bit cumbersome--this will be addressed in a future release.*

#### Running Tests
```bash
npm install grunt -g
npm install
npm test
```

See [CHANGELOG](https://github.com/gruntjs/grunt-contrib/blob/master/CHANGELOG) for release history.