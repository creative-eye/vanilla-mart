const path = require('path');
const webpack = require('webpack');


var webpackConfig = require('./webpack-config/webpack.dev.config.js');
webpackConfig.entry = {};

module.exports = function (config) {
    config.set({
        autoWatch: true,
        singleRun: false,
        basePath: '',
        autoWatchBatchDelay: 300,
        logLevel: config.LOG_INFO,
        browsers: ['Chrome'],
        coverageReporter: {
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcovonly', subdir: '.' },
            ],
        },
        files: [
            './webpack-config/tests.webpack.js',
        ],
        frameworks: [
            'jasmine',
        ],
        preprocessors: {
            './webpack-config/tests.webpack.js': ['webpack'],
        },
        //reporters: ['progress', 'coverage', 'html'],
        reporters: ['progress'],
        htmlReporter: {
            outputDir: 'karma_html', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: 'report-summary-filename', // report summary filename; browser info by default


            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false, // reports start folded (only with preserveDescribeNesting)
        },
        webpack: {
            cache: true,
            devtool: 'inline-source-map',
            watch: true,
            module: {
                preLoaders: [
                    {
                        test: /-test\.js$/,
                        include: [
                            path.resolve(__dirname, '../src'),
                            path.resolve(__dirname, '../src/__tests__'),
                        ],
                        exclude: /(node_modules)/,
                        loader: 'babel',
                    },
                    {
                        test: /\.js?$/,
                        include: /src/,
                        exclude: /(node_modules|)/,
                        loader: 'babel-istanbul',
                    },
                ],
                loaders: [
                    {
                        test: /\.js$/i,
                        //include: [
                        //    path.resolve(__dirname, '../src/js'),
                        //    path.resolve(__dirname, '../src/__tests__'),
                        //],
                        exclude: /(node_modules)/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        },
                    },
                ],
            },
        },
        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        },
        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-babel-preprocessor'),
            require('babel-core'),
            //require('babel-istanbul'),
        ],
        node: {
            fs: 'empty'
        },
    });
};
