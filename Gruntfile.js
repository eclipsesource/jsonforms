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
            utils: {
              src: ['components/utils/**/*.js'],
              filter: 'isFile',
              dest: 'temp/utils.js'
            },
            jsonforms_module: {
                src: ['components/**/jsonforms-*.js'],
                filter: 'isFile',
                dest: 'temp/jsonforms-module.js'
            },
            dist: {
                // Concat all files from components directory and include the embedded templates
                src: ['temp/utils.js', 'temp/jsonforms-module.js', 'temp/**/*.js'],
                filter: 'isFile',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        ts: {
            dist: {
                src: ['components/**/*.ts', ['typings/**/*.ts']],
                dest: '',
                reference: 'components/references.ts',
                options: {
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false
                }
            },
            test: {
                src: ['tests/**/*.ts', 'components/references.ts'],
                dest: '',
                reference: 'tests/references.ts',
                options: {
                    target: 'es5',
                    module: 'commonjs'
                }
            }
        },

        'angular-builder': {
            options: {
                mainModule: 'jsonforms',
                externalModules: ['ui.bootstrap', 'ui.validate', 'ui.grid', 'ui.grid.pagination', 'ui.grid.autoResize']
            },
            app: {
                src:  'components/**/*.js',
                dest: 'temp/jsonforms.js'
            }
        },

        //Config for embedding templates in angular module
        ngtemplates:  {
            dist:  {
                src: 'components/**/*.html',
                dest: 'temp/templates.js',
                options:    {
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true },
                    module: "jsonforms"
                }
            }
        },

        copy: {
            app: {
                files: [
                    // dist to app
                    {expand:true, cwd: 'dist/', src: ['**'], dest: 'app'}
                ]
            }
        },

        // Config for Uglify (= Minify) Task
        uglify: {
            options: {
                // Use default

                // Uncomment to ease debugging
                // mangle: false
            },
            dist: {
                src: 'dist/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },

        // Config for Jshint Task
        jshint: {
            beforeconcat: ['components/**'],
            afterconcat: ['dist/js/<%= pkg.name %>.js'],
            options: { jshintrc: '.jshintrc' }
        },

        less: {
            bootstrap: {
                options: {
                    modifyVars: {
                        "grid-columns": 100
                    }
                },
                files: {
                    'temp/bootstrap100col.css': 'node_modules/bootstrap/less/bootstrap.less'
                }
            },
            jsonforms: {
                options: {
                    paths: ['temp']
                },
                files: {
                    'dist/css/jsonforms.css': 'css/app.css'
                }
            }
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
                configFile: 'tests/e2e-tests/protractor.conf.js'
            },
            run: {}
        },

        watch: {
            js: {
                files: 'components/**',
                tasks: ['concat:dist', 'uglify:dist']
            },
            css: {
                files: 'css/**',
                tasks: ['less:bootstrap', 'less:jsonforms']
            },
            templates: {
                files: 'templates/**',
                tasks: ['ngtemplates:dist', "concat:dist", 'uglify:dist']
            },
            app: {
                files: ['dist/**'],
                tasks: ['copy:app']
            }
        },

        browserify: {
            dist: {
                //dest: 'dist/js/<%= pkg.name %>.js'
                src: ['dist/js/<%= pkg.name %>.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
                //dest: 'build/target.js'
                // Note: The entire `browserify-shim` config is inside `package.json`.
            }
        },
        clean: {
            dist: ["dist/**", "temp/**"],
            app: ["app/js/jsonforms*", "app/css/jsonforms*"],
            all: ["dist", "temp", "app/js/jsonforms*", "app/css/jsonforms*", "node_modules", "app/bower_components"]
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-less');

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');

    // inline templates into jsonforms.js
    grunt.loadNpmTasks('grunt-angular-templates');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    // Load the plugin that provides the "connect" task.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Load the plugin that provides the "protractor" task.
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-angular-builder');

    grunt.loadNpmTasks('grunt-ts');

    // Build distribution
    grunt.registerTask('dist', [
        'clean:dist',
        'less:bootstrap',
        'less:jsonforms',
        'ts:dist',
        'ngtemplates:dist',
        'angular-builder',
        'concat:utils',
        'concat:jsonforms_module',
        'concat:dist',
        'uglify:dist'
    ]);

    // Build example application
    grunt.registerTask('app', [
        'dist',
        'copy:app'
    ]);

    // Test unit and e2e tests
    grunt.registerTask('test', [
        'app',
        'ts:test',
        'karma',
        'connect',
        'protractor'
    ]);

    // Hint task
    grunt.registerTask('hint', [
        'jshint'
    ]);

    // Build distribution as default
    grunt.registerTask('default', [
        'dist'
    ]);

};