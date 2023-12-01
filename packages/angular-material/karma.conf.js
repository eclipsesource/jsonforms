// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      subdir: '.',
      reporters: [
        { type: 'lcov' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'dots'],

    browsers: [ config.singleRun ? 'ChromeHeadlessNoSandbox' : 'Chrome' ],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    restartOnFileChange: true,
    logLevel: config.LOG_INFO,

    webpackMiddleware: {
      stats: 'detailed',
    },

    webpackServer: {
      noInfo: true,
    },
  });
};
