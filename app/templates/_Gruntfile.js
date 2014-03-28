/*global module:false*/

/*Generated initially from grunt-init, heavily inspired by yo webapp*/

module.exports = function (grunt) {
  'use strict';
  
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  
  // Project configuration.
  grunt.initConfig({
    // Project settings
    config: {
      // Configurable paths
      app: 'app',
      dist: 'dist',
      famousBranch: 'develop'
    },
    shell: {
      famous: {
        command: [
          'git clone -b <%= config.famousBranch %> git@github.com:Famous/famous.git <%= config.app %>/src/famous',
          'cd <%= config.app %>/src/famous',
          'git submodule update --init'
        ].join('&&')
      },
      options: {
        stdout: true
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= config.app %>/src/{,*/}*.js'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      css: {
        files: ['<%= config.app %>/css/{,*/}*.css'],
        options: {
          livereload: true
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
    },
    
    // The actual grunt server settings
    connect: {
      options: {
        port: 1337,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= config.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },
    
    
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '**/**.{ico,png,txt,jpg}',
            '.htaccess',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
            'src/lib/**/**.js',
            '**/**.css'
          ]
        }]
      }
    },
    requirejs: {
      compile: {
        options: {
          optimize: 'uglify2',
          uglify2: {
            mangler: {
              toplevel: true
            }
          },
          baseUrl: '<%= config.app %>/src',
          out: '<%= config.dist %>/src/main.js',
          name: 'main'
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'watch'
    ]);
  });
  
  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'requirejs'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
