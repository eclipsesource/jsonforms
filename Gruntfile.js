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

        // Config for Karma (=Test) Task
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'karma']);

};