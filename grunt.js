/*global module */
module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        meta: {
          version: '2.6.3pre',
          banner: '/*!\n' +
            ' * Modernizr v<%= meta.version %>\n' +
            ' * modernizr.com\n *\n' +
            ' * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton\n' +
            ' * MIT License\n */'
        },
        qunit: {
            files: ['test/index.html']
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
                boss: true,
                browser: true,
                curly: false,
                devel: true,
                eqeqeq: false,
                eqnull: true,
                expr: true,
                evil: true,
                immed: false,
                laxcomma: true,
                newcap: false,
                noarg: true,
                smarttabs: true,
                sub: true,
                undef: true
            },
            globals: {
                Modernizr: true,
                DocumentTouch: true,
                TEST: true,
                SVGFEColorMatrixElement : true,
                Blob: true
            }
        }
    });

    grunt.registerTask('default', 'min');

    // Travis CI task.
    grunt.registerTask('travis', 'qunit');
};
