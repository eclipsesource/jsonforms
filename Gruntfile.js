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
            services: {
              src: ['components/services/**/*.js', '!components/services/**/*.spec.js'],
              filter: 'isFile',
              dest: 'temp/services.js'
            },
            jsonforms_module: {
                src: ['components/**/jsonforms-*.js'],
                filter: 'isFile',
                dest: 'temp/jsonforms-module.js'
            },
            dist: {
                // Concat all files from components directory and include the embedded templates
                src: ['temp/services.js', 'temp/jsonforms-module.js', 'temp/**/*.js'],
                filter: 'isFile',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        ts: {
            dist: {
                src: ['components/**/*.ts', '!components/**/*.spec.ts', 'typings/**/*.ts'],
                dest: '',
                reference: 'components/references.ts',
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false
                }
            },
            test: {
                src: ['tests/**/*.ts', 'components/references.ts', 'components/**/*.spec.ts'],
                dest: '',
                reference: 'tests/references.ts',
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false
                }
            }
        },

        'angular-builder': {
            options: {
                mainModule: 'jsonforms',
                externalModules: ['ui.bootstrap', 'ui.validate', 'ui.grid', 'ui.grid.edit', 'ui.grid.pagination', 'ui.grid.autoResize']
            },
            examples: {
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
            examples: {
                files: [
                    // dist to examples
                    {expand:true, cwd: 'dist/', src: ['**'], dest: 'examples'}
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
                    'dist/css/jsonforms.css': ['css/wrapper.css', 'components/**/*.css']
                }
            }
        },

        // Config for Karma (Unit Test) Task
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // Config for Connect (Start Webserver) Task
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'examples'
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
            examples: {
                files: ['dist/**'],
                tasks: ['copy:examples']
            }
        },

        clean: {
            dist: [
                'dist/**',
                'temp/**'
            ],
            examples: [
                'examples/js/jsonforms*',
                'examples/css/jsonforms*'
            ],
            dev: [
                'components/references.ts',
                'components/**/*.js',
                'components/**/*.js.map',
                'tests/references.ts',
                'tests/**/*.js',
                '!**/*.conf.js',
                'tests/**/*.js.map'
            ],
            downloads: [
                'examples/bower_components',
                'node_modules'
            ],
            coverage: [
                'coverage'
            ],
            cache: [
                '.tscache'
            ],
            all: [
                'dist',
                'temp',
                'examples/js/jsonforms*',
                'examples/css/jsonforms*',
                'components/references.ts',
                'components/**/*.js',
                'components/**/*.js.map',
                'tests/references.ts',
                'tests/**/*.js',
                '!**/*.conf.js',
                'tests/**/*.js.map',
                'examples/bower_components',
                'node_modules',
                'coverage',
                '.tscache'
            ]
        },

        remapIstanbul: {
            build: {
                src: 'coverage/coverage-final.json',
                options: {
                    reports: {
                        'html': 'coverage/html-report',
                        'json': 'coverage/mapped-coverage-final.json',
                        'lcovonly': 'coverage/mapped-coverage.info'
                    }
                }
            }
        },

        coveralls: {
            karma_tests: {
                src: 'coverage/mapped-coverage.info'
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Bump version to v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: false,
                push: false,
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },

        file_append: {
            bootstraplicense: {
                files: [
                    {
                        append:"\n############################################################################\n\nThis software includes a modified version of the Bootstrap framework\n(Copyright (c) 2011-2015 Twitter, Inc) within the dist/css/jsonforms.css file.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.",
                        input: 'LICENSE',
                        output: 'LICENSE'
                    }
                ]
            }
        },

        gitcheckout: {
            deploy: {
                options: {
                    branch: 'deploy-v<%= pkg.version %>',
                    overwrite: true
                }
            }
        },

        gitadd: {
            deploy: {
                options: {
                    force: true
                },
                files: {
                    src: ['dist', 'dist/**/*', 'LICENSE', 'components/references.ts']
                }
            }
        },

        gitcommit: {
            deploy: {
                options: {
                    message: "Release Version v<%= pkg.version %>"
                },
                files: {
                    src: ['dist', 'dist/**/*', 'LICENSE', 'components/references.ts']
                }
            }
        },

        gittag: {
            deploy: {
                options: {
                    tag: 'v<%= pkg.version %>',
                    message: 'Release version v%= pkg.version %'
                }
            }
        },

        gitpush: {
            deploy: {
                options: {
                    remote: 'upstream',
                    tags: true
                }
            }
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

    grunt.loadNpmTasks('remap-istanbul');

    grunt.loadNpmTasks('grunt-coveralls');

    grunt.loadNpmTasks('grunt-git');

    grunt.loadNpmTasks('grunt-bump');

    grunt.loadNpmTasks('grunt-file-append');

    // Build distribution
    grunt.registerTask('dist', [
        'clean:dist',
        'less:bootstrap',
        'less:jsonforms',
        'ts:dist',
        'ngtemplates:dist',
        'angular-builder',
        'concat:services',
        'concat:jsonforms_module',
        'concat:dist',
        'uglify:dist'
    ]);

    // Build example applications
    grunt.registerTask('examples', [
        'dist',
        'copy:examples'
    ]);

    // Test unit and e2e tests
    grunt.registerTask('test', [
        'clean:coverage',
        'examples',
        'ts:test',
        'karma',
        'connect',
        'protractor',
        'remapIstanbul'
    ]);

    // Hint task
    grunt.registerTask('hint', [
        'jshint'
    ]);

    grunt.registerTask('deploy', [
        'dist',
        'bump-only:patch',
        'bump-commit',
        'file_append:bootstraplicense',
        'gitcheckout:deploy',
        'gitadd:deploy',
        'gitcommit:deploy',
        'gittag:deploy',
        'gitpush:deploy'
    ]);

    // Build distribution as default
    grunt.registerTask('default', [
        'dist'
    ]);

};
