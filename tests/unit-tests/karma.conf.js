module.exports = function(config){
    config.set({

        basePath : '../../',

        // load templates as module
        preprocessors: {
            'components/**/*.html': ['ng-html2js']
        },

        files : [
            'examples/bower_components/traverse/traverse.js',
            'examples/bower_components/json-refs/browser/json-refs.js',
            'examples/bower_components/angular/angular.js',
            'examples/bower_components/angular-route/angular-route.js',
            'examples/bower_components/angular-mocks/angular-mocks.js',
            'examples/bower_components/angular-ui-ace/ui-ace.js',
            'examples/bower_components/angular-ui-grid/ui-grid.js',
            'examples/bower_components/ui-utils/ui-utils.js',
            'examples/bower_components/angular-ui-bootstrap-bower/ui-bootstrap.js',
            'examples/bower_components/tv4/tv4.js',
            'dist/js/jsonforms.js',
            'tests/unit-tests/**/*.js',
            //'app/js/*.js',
            // templates
            // if you wanna load template files in nested directories, you must use this
            'components/**/*.html'
        ],

        autoWatch : true,

        captureConsole: true,

        frameworks: ['jasmine'],

        browsers : ['Firefox'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-ng-html2js-preprocessor'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
