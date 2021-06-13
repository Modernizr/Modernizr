'use strict';

import gulp             from 'gulp';
import connect          from 'gulp-connect';
import eslint           from 'gulp-eslint';
import pug              from 'gulp-pug';
import del              from 'del';
import fs               from 'fs-extra';
import globby           from 'globby';
import Mocha            from 'mocha';
import Mochaheadless    from 'mocha-headless-chrome';

import modernizr        from './lib/cli';
import config           from './lib/config-all';

const directories = {
  browserTests: globby.sync([
    'test/universal/**/*.js',
    'test/browser/**/*.js',
    '!test/browser/setup.js',
    '!test/browser/integration/*.js'
  ]),
  integrationTests: globby.sync([
    'test/browser/integration/*.js'
  ]),
  nodeTests: globby.sync([
    'test/universal/**/*.js',
    'test/node/**/*.js'
  ])
};

let failures = 0;

gulp.task('clean', () => {
  return del([
    'dist',
    'gh-pages',
    'test/coverage',
    'test/*.html',
    'tmp'
  ]);
});

gulp.task('copy:gh-pages', () => {
  return gulp.src([
    './dist/**/*',
    './lib/**/*',
    './node_modules/chai/**/*',
    './node_modules/jquery/**/*',
    './node_modules/json3/**/*',
    './node_modules/lodash/**/*',
    './node_modules/mocha/**/*',
    './node_modules/requirejs/**/*',
    './node_modules/sinon/**/*',
    './node_modules/ua-parser-js/**/*',
    './src/**/*',
    './test/**/*',
    '!./test/coverage/**/*'
  ], { 'base' : '.' })
    .pipe(gulp.dest('gh-pages/'))
});

gulp.task('eslint', () => {
  return gulp.src([
    ...directories.browserTests,
    ...directories.integrationTests,
    ...directories.nodeTests,
    'feature-detects/**/*.js',
    'lib/*.js',
    'src/*.js',
    'test/**/*.js',
    '!src/html5shiv.js',
    '!src/html5printshiv.js',
    '!test/coverage/**/*.js'
  ])
    .pipe(eslint({
      fix: true,
      configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('generate', (done) => {
  modernizr.build(config, function(output) {
    fs.outputFile('dist/modernizr-build.js', output).then(() => {
      done();
    })
  });
});

gulp.task('mocha:browser', (done) => {
  const options = {
    reporter: 'dot',
    timeout: 5000,
    args: ['disable-web-security']
  };
  Mochaheadless.runner({
    ...options,
    file: 'test/integration.html',
  })
    .then(result => {
      failures += result.result.failures.length;
      return Mochaheadless.runner({
        ...options,
        file: 'test/unit.html'
      });
    })
    .then(result => {
      failures += result.result.failures.length;
      process.exitCode = failures;  // exit with non-zero status if there were failures
      done();
    });
});

gulp.task('mocha:node', (done) => {
  const mocha = new Mocha({
    reporter: 'dot',
    timeout: 5000
  });

  directories.nodeTests.forEach(file => {
    mocha.addFile(file);
  });

  // Run the tests.
  mocha.run(fails => {
    failures += fails;
    done();
  });
});

gulp.task('pug', () => {
  return gulp.src('test/browser/*.pug')
    .pipe(pug({
      data: {
        browserTests: directories.browserTests,
        integrationTests: directories.integrationTests
      }
    }))
    .pipe(gulp.dest('test/'))
});

gulp.task('serve:gh-pages', gulp.series('clean', 'generate', 'pug',  'copy:gh-pages', (done) => {
  connect.server({
    root: 'gh-pages/'
  });
  done();
}));

gulp.task('test', gulp.series('clean', 'eslint', 'generate', 'pug', 'mocha:node', 'mocha:browser'));

gulp.task('gh-pages', gulp.series('clean', 'pug', 'generate', 'copy:gh-pages'));

gulp.task('default', gulp.series('clean', 'eslint', 'generate'));
