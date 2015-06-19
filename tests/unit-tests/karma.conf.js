module.exports = function(config){
  config.set({

    basePath : '../../',

    // load templates as module
    preprocessors: {
        'templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // If your build process changes the path to your templates,
      // use stripPrefix and prependPrefix to adjust it.
      //stripPrefix: "..",
      prependPrefix: "../"

      // the name of the Angular module to create
      //moduleName: "jsonForms.templates"
    },

    files : [
      'app/bower_components/tv4/tv4.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-ui-ace/ui-ace.js',
      'app/bower_components/angular-ui-grid/ui-grid.js',
      //'app/bower_components/angular-ui/build/angular-ui.js',
      'app/bower_components/ui-utils/ui-utils.js',
      'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap.js',
      'app/bower_components/dojo/dojo.js',
      'app/bower_components/dojox/json/ref.js',
      'app/bower_components/dojox/json/query.js',
      'app/bower_components/dojox/json/schema.js',
      {pattern: 'app/bower_components/dojo*/*.js', included: false, watched: false},
      {pattern: 'app/bower_components/dojo*/**/*.js', included: false, watched: false},
      'tests/unit-tests/**/*.js',
      'app/js/*.js',
      // templates
      // if you wanna load template files in nested directories, you must use this
      'templates/*.html'
    ],

    autoWatch : true,

    captureConsole: true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

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
