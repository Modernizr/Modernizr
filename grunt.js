/*global module */
module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        meta: {
          version: '2.5.3',
          banner: '/*!\n' +
            ' * Modernizr v<%= meta.version %>\n' +
            ' * www.modernizr.com\n *\n' +
            ' * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton\n' +
            ' * Available under the BSD and MIT licenses: www.modernizr.com/license/\n */'
        },
        lint: {
            files: [
                'grunt.js',
                'modernizr.js',
                'feature-detects/*.js'
            ]
        },
        min: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    'modernizr.js'
                ],
                dest: 'modernizr.min.js'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                Modernizr: true
            }
        }
    });

    grunt.registerTask('default', 'min');

};