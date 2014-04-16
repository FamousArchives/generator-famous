// Watches files for changes and runs tasks based on the changed files
module.exports = function(grunt) {
  'use strict';
  return {
    bower: {
      files: ['bower.json'],
      tasks: ['bower']
    },
    js: {
      files: ['<%= config.app %>/src/**/**.js'],
      tasks: ['lint'],
      options: {
        livereload: grunt.option('livereload') || true
      }
    },
    gruntfile: {
      files: ['Gruntfile.js']
    },
    css: {
      files: ['<%= config.app %>/css/{,*/}*.css'],
      options: {
        livereload: grunt.option('livereload') || true
      }
    },
    livereload: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      files: [
        '<%= config.app %>/{,*/}*.html',
        '<%= config.app %>/styles/**/**.css',
        '<%= config.app %>/images/{,*/}*'
      ]
    }
  };
};
