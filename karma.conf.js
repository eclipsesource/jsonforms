'use strict';

var webpackConfig = require('./webpack/webpack.test.js');
require('phantomjs-polyfill');
webpackConfig.entry = {};

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["PhantomJS2"],
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-webpack',
            'karma-phantomjs2-launcher'
        ],
        singleRun: true,
        autoWatchBatchDelay: 300,
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './src/test.ts'
        ],
        babelPreprocessor: {
            options: {
                presets: ['es2015']
            }
        },
        preprocessors: {
            'src/test.ts': ['webpack'],
            'src/**/!(*.spec)+(.js)': ['coverage']
        },
        webpackMiddleware: {
            stats: {
                chunkModules: false,
                colors: true
            }
        },
        webpack: webpackConfig,
        reporters: [
            'dots',
            'spec',
            'coverage'
        ],
        coverageReporter: {
            reporters: [
                {
                    dir: 'reports/coverage/html-report',
                    subdir: '.',
                    type: 'html'
                }, {
                    dir: 'reports/coverage/lcov-report',
                    subdir: '.',
                    type: 'lcov'
                }
            ]
        }
    });
};
