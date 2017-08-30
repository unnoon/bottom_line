const tsconfig = require('./tsconfig.json');

module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],
        files: [
            { pattern: 'src/**/*.ts' }, // *.tsx for React Jsx
            { pattern: 'test/unit/**/*.spec.ts' }, // *.tsx for React Jsx
        ],
        preprocessors: {
            '**/*.ts': ['karma-typescript'], // *.tsx for React Jsx
        },
        reporters: ['progress', 'karma-typescript'],
        karmaTypescriptConfig: {
            'compilerOptions': tsconfig.compilerOptions,
            reports: {
                'html': '.coverage',
                'text-summary': '',
                'lcovonly': '.coverage',
                'text-lcov': ''
            },
        },
        browsers: ['ChromeHeadless'],
    });
};