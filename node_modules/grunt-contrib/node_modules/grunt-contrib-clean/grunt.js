module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    lint: {
      all: ["grunt.js", "tasks/*.js"]
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
        node: true,
        es5: true
      }
    }
  });

  grunt.registerTask("default", "lint");
  grunt.loadTasks("tasks");
};