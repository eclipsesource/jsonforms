module.exports = function(config){
    config.set({

        basePath : '',

        // load templates as module
        preprocessors: {
            'components/**/*.html': ['ng-html2js'],
            'components/**/*.js': ['coverage']
        },

        files : [
            'examples/bower_components/traverse/traverse.js',
            'examples/bower_components/json-refs/browser/json-refs.js',
            'examples/bower_components/angular/angular.js',
            'examples/bower_components/angular-route/angular-route.js',
            'examples/bower_components/angular-mocks/angular-mocks.js',
            'examples/bower_components/angular-ui-ace/ui-ace.js',
            'examples/bower_components/angular-ui-grid/ui-grid.js',
            'examples/bower_components/tv4/tv4.js',
            'components/utils/**/*.js',
            'components/**/jsonforms*.js',
            'components/**/*.js',
            'components/**/*.html'
        ],

        reporters: ['progress', 'coverage'],

        // optionally, configure the reporter
        coverageReporter: {
            type : 'json',
            subdir : '.',
            file : 'coverage-final.json'
        },

        autoWatch : true,

        captureConsole: true,

        frameworks: ['jasmine', 'angular-filesort'],

        browsers : ['Firefox'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-angular-filesort',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],


        angularFilesort: {
            whitelist: [
                'components/**/*.js'
            ]
        },

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
