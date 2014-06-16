module.exports = function (config) {
    config.set({
            basePath: '../',
            frameworks: ['jasmine'],
            files: [
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-mocks/angular-mocks.js',
                'src/sp/**/sp.js',
                'src/sp/**/*.js',
                'test/mocks/sp/**/*.js',
                'test/unit/sp/**/*.js'
            ],
            plugins: [
                'karma-jasmine',
                'karma-junit-reporter',
                'karma-coverage',
                'karma-chrome-launcher',
                'karma-firefox-launcher',
                'karma-phantomjs-launcher'
            ],
            exclude: [],
            reporters: ['progress', 'coverage'],
            preprocessors: {
                'src/sp/**/*.js': 'coverage'
            },
            junitReporter: {
                outputFile: 'results/junit/report.xml'
            },
            coverageReporter: {
                reporters: [
                    {type: 'html', dir: 'results/junit/coverage'},
                    {type: 'json', dir: 'results/junit/coverage'},
                    {type: 'text-summary'}
                ]
            },
            colors: true,
            logLevel: config.LOG_INFO,
            autoWatch: true,
            browsers: ['PhantomJS'],
            captureTimeout: 10000,
            singleRun: false
        }
    );
};
