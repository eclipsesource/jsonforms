module.exports = function(config){
    config.set({
        failOnEmptyTestSuite : false,
        basePath : '.',

        // load templates as module
        preprocessors: {
            'components/**/*.html': ['ng-html2js'],
            'components/**/*.js': ['coverage']
        },

        files : [
            'bower_components/traverse/traverse.js',
            'bower_components/json-refs/browser/json-refs.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-loader/angular-loader.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-ace/ui-ace.js',
            'bower_components/angular-ui-validate/dist/validate.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ui-grid/ui-grid.js',
            'bower_components/tv4/tv4.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/jsonforms/dist/js/jsonforms.js',
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
                'components/**/*.js', 'components/**/jsonforms*.js'
            ]
        },

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
