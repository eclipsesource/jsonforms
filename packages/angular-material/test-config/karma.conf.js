var webpackConfig = require('./webpack.test.js');

module.exports = function (config) {
  var _config = {
    basePath: '../',

    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-coverage-istanbul-reporter'),
    ],

    frameworks: ['jasmine'],

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
      dir: require('path').join(__dirname, '../../coverage/foobar'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    files: [
      {
        pattern: './test-config/karma-test-shim.js',
        watched: true,
      },
    ],

    preprocessors: {
      './test-config/karma-test-shim.js': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
    },

    webpackServer: {
      noInfo: true,
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true,
    },

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },

    reporters: config.coverage
      ? ['kjhtml', 'dots', 'coverage-istanbul']
      : ['kjhtml', 'dots'],
    port: 9876,

    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // browsers: ['ChromeHeadlessNoSandbox'],
    // customLaunchers: {
    //   ChromeHeadlessNoSandbox: {
    //     base: 'ChromeHeadless',
    //     flags: ['--no-sandbox'],
    //   },
    // },
    browsers: ['Chrome'],
    singleRun: false,
  };

  config.set(_config);
};
