"use strict";

/*global require, module, done, process */
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    var serverPort = grunt.option('serverPort') || 11000;
    var reloadPort = grunt.option('reloadPort') || 10999;
    var hostname = grunt.option('hostname') || '0.0.0.0';

    grunt.initConfig({
        config: {},
        watch: {
            livereload: {
                options: {
                    port: reloadPort
                },
                files: [
                    'src/{,*/}*.html',
                    'src/{,*/}*.js'
                ]
            }
        },
        connect: {
            options: {
                port: serverPort,
                hostname: hostname
            },
            runtime: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'instrumented'),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        clean: {
            files: [
                'results',
                'build',
                'instrumented'
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-junit-reporter'),
                reporterOutput: 'results/jshint/jshint.xml'
            }, files: {
                src: ['src/sp/**/*.js']
            }
        },
        karma: {
            options: {
                singleRun: true,
                reporters: ['progress', 'coverage', 'junit']
            },
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },
        instrument: {
            files: 'src/sp/**/*.js',
            options: {
                lazy: true,
                basePath: "instrumented"
            }
        },
        protractor_coverage: {
            options: {
                keepAlive: true,
                noColor: false,
                coverageDir: 'results/protractor/coverage',
                args: {
                    baseUrl: 'http://<%= connect.options.hostname %>:' + serverPort
                }
            },
            local: {
                options: {
                    configFile: 'config/protractor-local.conf.js'
                }
            },
            travis: {
                options: {
                    configFile: 'config/protractor-travis.conf.js'
                }
            }
        },
        makeReport: {
            src: 'results/protractor/coverage/*.json',
            options: {
                type: 'lcov',
                dir: 'results/coverage/protractor',
                print: 'detail'
            }
        },
        concat: {
            all: {
                files: {
                    'build/spectingular.js': [
                        'src/sp/**/*.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! Built by Spectingular on <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %> */\n'
            },
            all: {
                files: {
                    'build/spectingular.min.js': [
                        'build/spectingular.js'
                    ]
                }
            }
        }
    });


    grunt.registerTask('travis', 'Run code quality checks on Travis CI and package', ['clean', 'jshint', 'karma', 'protractor:travis', 'package']);
    grunt.registerTask('local', 'Run code quality checks locally and package', ['clean', 'jshint', 'karma', 'protractor:local', 'package']);
    grunt.registerTask('protractor', 'Run protractor tests with coverage on the given environment',  function (environment) {
        grunt.task.run([
            'instrument',
            'connect',
            'protractor_coverage:' + environment,
            'makeReport'
        ]);
    });
    grunt.registerTask('package', 'Package the build files', ['concat', 'uglify']);

};