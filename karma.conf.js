var webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            'test/unit/**/*.ts'
        ],
        exclude: [
        ],
        preprocessors: {
            'test/unit/**/*.ts': ['webpack']
        },
        mime: {
            'text/x-typescript': ['ts']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters     : ['dots', 'coverage'],
        coverageReporter: {
            dir : '.cov/',
            reporters: [
                { type: 'html', subdir: '' },
                { type: 'lcov', subdir: 'report-lcov' }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // browsers: ['PhantomJS'],
        // browsers: ['Chrome'],
        // browsers: ['Firefox'],
        browsers: ['ChromeHeadless'],
        singleRun: false,
        concurrency: Infinity
    })
};