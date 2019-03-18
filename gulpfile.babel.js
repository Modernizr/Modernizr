'use strict';

import gulp             from    'gulp';
import gplugins         from    'gulp-load-plugins';
import del              from    'del';
import fs               from    'fs-extra';
import glob             from    'glob';

import modernizr        from './lib/cli';
import config           from './lib/config-all';

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

gulp.task('copy:gh-pages', () => {
  return gulp.src([
    './**/*',
    '!./test/coverage/**',
    '!./node_modules/*grunt-*/**',
    '!./node_modules/**/node_modules/**'
  ])
    .pipe(gulp.dest('gh-pages/'))
});

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

gulp.task('mocha:node', () =>
  gulp.src(directories.nodeTests, {read: false})
    .pipe(plugins.mocha( {
      reporter: 'dot',
      timeout: 5000
    }))
);

gulp.task('pug', () => {
  return gulp.src('test/browser/*.pug')
    .pipe(plugins.pug({
      data: {
        unitTests: glob.sync(directories.browserTests.join(',')),
        integrationTests: glob.sync(directories.integrationTests.join(','))
      }
    }))
    .pipe(gulp.dest('test/'))
});

gulp.task('default', gulp.series('clean', 'eslint', 'generate'));
