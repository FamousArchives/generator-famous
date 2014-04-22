// Watches files for changes and runs tasks based on the changed files
module.exports = function(grunt) {
  'use strict';
  return {
    options: {
      livereload: grunt.option('livereload') || true
    },
    gruntfile: {
      files: ['Gruntfile.js', 'grunt/**/**'],
      options: {
        reload: true
      }
    },
    js: {
      files: ['<%= config.app %>/src/**/**.js'],
      tasks: ['lint']
    },
    css: {
      files: ['<%= config.app %>/styles/{,*/}*.css']
    },
    html: {
      files: ['<%= config.app %>/{,*/}*.html'],
      tasks: ['processhtml:dev']
    },
    content: {
      files: [
        '<%= config.app %>/content/**/**'
      ]
    }
  };
};
