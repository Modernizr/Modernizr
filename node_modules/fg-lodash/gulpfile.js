/*
 * lodash
 *
 * Copyright(c) 2014  <>
 * MIT Licensed
 *
 */

/**
 * @author  <>
 *
 */

'use strict';

var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    jasmine = require('gulp-jasmine'),
    paths   = {};

paths.sources = ['./lib/**/*.js', './specs/**/*.js', 'gulpfile.js', 'index.js'];
paths.specs   = ['./specs/**/*.spec.js'];

gulp.task('lint', function () {
    gulp.src(paths.sources)
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    gulp.src(paths.specs)
        .pipe(jasmine());
});

gulp.task('default', ['lint', 'test']);