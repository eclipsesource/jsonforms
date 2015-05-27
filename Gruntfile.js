module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Config for Concat Task
        concat: {
            options: {
                // Remove all existing banners
                stripBanners: true,

                // Replace all 'use strict' statements in the code with a single one at the top
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },

                // Add new banner on top of generated file
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> Copyright (c) EclipseSource Muenchen GmbH and others. */ \n' +
                "'use strict';\n"
            },
            dist: {
                // Concat all files from app/js directory
                src: ['app/js/**'],
                filter: 'isFile',
                dest: 'bin/<%= pkg.name %>_<%= pkg.version %>.js'
            }
        },

        // Config for Uglify (= Minify) Task
        uglify: {
            options: {
                // Use default
            },
            build: {
                src: 'bin/<%= pkg.name %>_<%= pkg.version %>.js',
                dest: 'bin/<%= pkg.name %>_<%= pkg.version %>.min.js'
            }
        },

        // Config for Jshint Task
        jshint: {
            beforeconcat: ['app/js/**'],
            afterconcat: ['bin/<%= pkg.name %>_<%= pkg.version %>.js'],
            options: { jshintrc: '.jshintrc' }
        },

        // Config for Karma (Unit Test) Task
        karma: {
            unit: {
                configFile: 'tests/unit-tests/karma.conf.js',
                singleRun: true
            }
        },

        // Config for Connect (Start Webserver) Task
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'app'
                }
            }
        },

        // Config for Protractor (e2e Test) Task
        protractor: {
            options: {
                configFile: "tests/e2e-tests/protractor.conf.js"
            },
            run: {}
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    // Load the plugin that provides the "connect" task.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Load the plugin that provides the "protractor" task.
    grunt.loadNpmTasks('grunt-protractor-runner');

    // Default task(s).
    grunt.registerTask('default', [
        'karma',
        'concat',
        'uglify']);

    // Test tasks
    grunt.registerTask('test', [
        'karma',
        'connect',
        'protractor'
    ]);

    // Hint task
    grunt.registerTask('hint', [
        'jshint'
    ]);

};