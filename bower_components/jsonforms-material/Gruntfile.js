module.exports = function(grunt) {

    var jsonformsLocation = 'bower_components/jsonforms/';

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
                dest: 'temp/jsonforms-material-module.js'
            },
            dist: {
                // Concat all files from components directory and include the embedded templates
                src: ['temp/utils.js', 'temp/jsonforms-material-module.js', 'temp/**/*.js'],
                filter: 'isFile',
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        ts: {
            jsonforms: {
                src: [jsonformsLocation + 'components/**/*.ts', jsonformsLocation + 'typings/**/*.ts'],
                dest: '',
                reference: jsonformsLocation + 'components/references.ts',
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false
                }
            },
            dist: {
                src: [jsonformsLocation + 'components/references.ts','components/**/*.ts'],
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
                src: ['components/**/*spec.ts', 'components/references.ts'],
                dest: '',
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: true,
                    declaration: false
                }
            }
        },

        less: {
            jsonforms_material: {
                options: {
                    paths: ['temp']
                },
                files: {
                    'dist/css/jsonforms-material.css': ['components/**/*.css']
                }
            }
        },

        'angular-builder': {
            options: {
                mainModule: 'jsonforms-material',
                externalModules: ['jsonforms','jsonforms.renderers']
            },
            jsonforms_material: {
                src:  'components/**/*.js',
                dest: 'temp/jsonforms-material.js'
            }
        },

        //Config for embedding templates in angular module
        ngtemplates:  {
            dist:  {
                src: 'components/**/*.html',
                dest: 'temp/templates.js',
                options:    {
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true },
                    module: "jsonforms-material"
                }
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

        // Config for Karma (Unit Test) Task
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        clean: {
            dist: [
                'dist/**',
                'temp/**'
            ],
            dev: [
                'components/references.ts',
                'components/**/*.js',
                'components/**/*.js.map',
                'tests/references.ts',
                'tests/**/*.js',
                '!tests/**/*.conf.js',
                'tests/**/*.js.map'
            ],
            downloads: [
                'bower_components',
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
                'components/references.ts',
                'components/**/*.js',
                'components/**/*.js.map',
                'tests/references.ts',
                'tests/**/*.js',
                '!tests/**/*.conf.js',
                'tests/**/*.js.map',
                'bower_components',
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
                    src: ['dist', 'dist/**/*', 'LICENSE']
                }
            }
        },

        gitcommit: {
            deploy: {
                options: {
                    message: "Release Version v<%= pkg.version %>"
                },
                files: {
                    src: ['dist', 'dist/**/*', 'LICENSE']
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
        },

        copy: {
            examples: {
                files: [
                    // dist to examples
                    {expand:true, cwd: 'dist/', src: ['**'], dest: 'examples'}
                ]
            }
        },
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-less');

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');

    // inline templates into jsonforms.js
    grunt.loadNpmTasks('grunt-angular-templates');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "karma" task.
    grunt.loadNpmTasks('grunt-karma');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-angular-builder');

    grunt.loadNpmTasks('grunt-ts');

    grunt.loadNpmTasks('remap-istanbul');

    grunt.loadNpmTasks('grunt-coveralls');

    grunt.loadNpmTasks('grunt-git');

    grunt.loadNpmTasks('grunt-bump');

    // Build distribution
    grunt.registerTask('dist', [
        'ts:jsonforms',
        'clean:dist',
        'less:jsonforms_material',
        'ts:dist',
        'ngtemplates:dist',
        'angular-builder',
        'concat:utils',
        'concat:jsonforms_module',
        'concat:dist',
        'uglify:dist'
    ]);

    // Test unit and e2e tests
    grunt.registerTask('test', [
        'clean:coverage',
        'ts:test',
        'karma',
        'remapIstanbul'
    ]);

    grunt.registerTask('deploy', [
        'dist',
        'bump-only:patch',
        'bump-commit',
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

    // Build example applications
    grunt.registerTask('examples', [
        'dist',
        'copy:examples'
    ]);
};
