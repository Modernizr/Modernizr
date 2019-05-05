'use strict';

import gulp             from 'gulp';
import gplugins         from 'gulp-load-plugins';
import del              from 'del';
import fs               from 'fs-extra';
import globby           from 'globby';
import { runner }       from 'mocha-headless-chrome';

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
  nodeTests: [
    'test/universal/**/*.js',
    'test/node/**/*.js'
  ],
  mochaTests: [
    'test/unit.html',
    'test/integration.html'
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
    'feature-detects/**/*.js',
    'lib/*.js',
    'src/*.js',
    'test/**/*.js',
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

gulp.task('mocha:browser', (done) => {
  const options = {
    reporter: 'dot',
    timeout: 5000,
    args: ['disable-web-security']
  };
  runner({
    ...options,
    file: 'test/integration.html',
  })
    .then(result => {
      //let json = JSON.stringify(result);
      //console.log(json);

      runner({
        ...options,
        file: 'test/unit.html'
      })
        .then(result => {
          done();
          //let json = JSON.stringify(result);
          //console.log(json);
        });
    });
  }
);

gulp.task('mocha:node', () => {
    return gulp.src(directories.nodeTests, {read: false})
      .pipe(plugins.mocha({
        reporter: 'dot',
        timeout: 5000
      }))
  }
);

gulp.task('pug', () => {
  return gulp.src('test/browser/*.pug')
    .pipe(plugins.pug({
      data: {
        browserTests: directories.browserTests,
        integrationTests: directories.integrationTests
      }
    }))
    .pipe(gulp.dest('test/'))
});

gulp.task('test', gulp.series('clean', 'eslint', 'generate', 'pug', 'mocha:node', 'mocha:browser'));

gulp.task('default', gulp.series('clean', 'eslint', 'generate'));
