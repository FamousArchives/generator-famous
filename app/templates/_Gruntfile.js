/*global module:false*/

/*Generated initially from grunt-init, heavily inspired by yo webapp*/

module.exports = function(grunt) {
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
            dist: 'dist'
        },
        eslint: {
            options: {
                config: '.eslintrc'
            },
            target: ['<%= config.app %>/src/**/**.js']
        },

        jscs: {
            src: ['<%= config.app %>/src/**/**.js', 'Gruntfile.js'],
            options: {
                config: '.jscsrc'
            }
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bower']
            },
            js: {
                files: ['<%= config.app %>/src/**/**.js'],
                tasks: ['jscs', 'eslint'],
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
                port: grunt.option('port') || 1337,
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

        // Automagically wire-up installed Bower components into your RequireJS config
        bower: {
            raget: {
                rjsConfig: '<%= config.app %>/src/requireConfig.js'
            }
        },

        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/src/{,*/}*.js',
                        '<%= config.dist %>/css/{,*/}*.css',
                        // '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/css/fonts/{,*/}*.*',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },

        processhtml: {
            dev: {
                files: {
                    '.tmp/index.html': ['<%= config.app %>/index.html']
                }
            },
            dist: {
                files: {
                    '<%= config.dist %>/index.html': ['<%= config.app %>/index.html']
                }
            },
            options: {
                commentMarker: 'process'
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, uglify and revision files. Creates configurations in memory so
        // additional tasks can operate on them

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.dist %>/index.html'
        },

        // Performs reqrite based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css']
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
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
                        // '{,*/}*.html',
                        'styles/fonts/{,*/}*.*',
                        'lib/famous/**/**.css'
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
                    mainConfigFile: '<%= config.app %>/src/requireConfig.js',
                    name: 'almond',
                    include: 'main',
                    insertRequire: ['main'],
                    out: '<%= config.dist %>/src/main.js',
                    wrap: true
                }
            }
        }
    });

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'jscs',
            'eslint',
            'processhtml:dev',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jscs',
        'eslint',
        'processhtml:dist',
        'useminPrepare',
        'requirejs',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};
