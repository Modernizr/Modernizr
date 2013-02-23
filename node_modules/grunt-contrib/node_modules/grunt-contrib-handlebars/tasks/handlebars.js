/*
 * grunt-contrib-handlebars
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tim Branyen, contributors
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var helpers = require('grunt-lib-contrib').init(grunt);

  // filename conversion for templates
  var defaultProcessName = function(name) { return name; };

  // filename conversion for partials
  var defaultProcessPartialName = function(filePath) {
    var pieces = _.last(filePath.split('/')).split('.');
    var name   = _(pieces).without(_.last(pieces)).join('.'); // strips file extension
    return name.substr(1, name.length);                       // strips leading _ character
  };

  grunt.registerMultiTask('handlebars', 'Compile handlebars templates and partials.', function() {

    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this, {namespace: 'JST'});

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var compiled, srcFiles, src, filename;
    var partials = [];
    var templates = [];
    var output = [];
    var nsInfo = helpers.getNamespaceDeclaration(options.namespace);

    // assign regex for partial detection
    var isPartial = options.partialRegex || /^_/;

    // assign filename transformation functions
    var processName = options.processName || defaultProcessName;
    var processPartialName = options.processPartialName || defaultProcessPartialName;

    // iterate files, processing partials and templates separately
    this.files.forEach(function(files) {
      srcFiles = grunt.file.expandFiles(files.src);
      srcFiles.forEach(function(file) {
        src = grunt.file.read(file);

        try {
          compiled = require('handlebars').precompile(src);
          // if configured to, wrap template in Handlebars.template call
          if(options.wrapped) {
            compiled = 'Handlebars.template('+compiled+')';
          }
        } catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('Handlebars failed to compile '+file+'.');
        }

        // register partial or add template to namespace
        if(isPartial.test(_.last(file.split('/')))) {
          filename = processPartialName(file);
          partials.push('Handlebars.registerPartial('+JSON.stringify(filename)+', '+compiled+');');
        } else {
          filename = processName(file);
          templates.push(nsInfo.namespace+'['+JSON.stringify(filename)+'] = '+compiled+';');
        }
      });
      output = output.concat(partials, templates);

      if (output.length > 0) {
        output.unshift(nsInfo.declaration);
        grunt.file.write(files.dest, output.join('\n\n'));
        grunt.log.writeln('File "' + files.dest + '" created.');
      }
    });
  });

};
