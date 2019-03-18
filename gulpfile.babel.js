'use strict';

import gulp             from    'gulp';
import gplugins         from    'gulp-load-plugins';
import del              from    'del';
import fs               from    'fs-extra';

import modernizr from './lib/cli';
import config from './lib/config-all';

const directories = {
    browserTests: [
      'test/universal/**/*.js',
      'test/browser/**/*.js',
      '!test/browser/setup.js',
      '!test/browser/integration/*.js'
    ],
    integrationTests: [
      'test/browser/integration/*.js'
    ],
    nodeTests: [
      'test/universal/**/*.js',
      'test/node/**/*.js'
    ]
};
const plugins = gplugins();

gulp.task('clean', () => {
    return del([
      'dist',
      'test/coverage',
      'test/*.html',
      'gh-pages'
    ]);
});

// Detect errors and potential problems in your JavaScript code (except vendor scripts)
gulp.task('eslint', () => {
  return gulp.src([
    ...directories.browserTests,
    ...directories.integrationTests,
    ...directories.nodeTests,
    'test/browser/setup.js',
    'Gruntfile.js',
    'src/*.js',
    'lib/*.js',
    'test/**/*.js',
    'feature-detects/**/*.js',
    '!src/html5shiv.js',
    '!src/html5printshiv.js',
    '!test/coverage/**/*.js'
  ])
    .pipe(plugins.eslint({
      configFile: '.eslintrc'
    }))
    .pipe(plugins.eslint.failOnError());
});

gulp.task('generate', (done) => {
  modernizr.build(config, function(output) {
    fs.outputFile('dist/modernizr-build.js', output).then(() => {
      done();
    })
  });
});

gulp.task('default', gulp.series('clean', 'eslint', 'generate'));
