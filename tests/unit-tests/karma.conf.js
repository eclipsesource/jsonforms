module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/dojo/dojo.js',
      'app/bower_components/dojox/json/ref.js',
      'app/bower_components/dojox/json/query.js',
      'app/bower_components/dojox/json/schema.js',
      {pattern: 'app/bower_components/dojo*/*.js', included: false, watched: false},
      {pattern: 'app/bower_components/dojo*/**/*.js', included: false, watched: false},
      'tests/unit-tests/**/*.js',
      'app/js/**/*.js'
    ],

    autoWatch : true,

    captureConsole: true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
