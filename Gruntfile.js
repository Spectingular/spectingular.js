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
        shell: {
            options: {
                stdout: true
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            }
        },
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
            }
        },
        makeReport: {
            src: 'results/protractor/coverage/*.json',
            options: {
                type: 'lcov',
                dir: 'results/coverage/protractor'
            }
        }
    });

    grunt.registerTask('travis', function () {
        grunt.task.run([
            'clean',
            'jshint',
            'karma'
//            'instrument',
//            'connect',
//            'protractor_coverage:travis',
//            'makeReport'
        ]);
    });

    grunt.registerTask('local', function () {
        grunt.task.run([
            'clean',
            'jshint',
            'karma',
            'instrument',
            'connect',
            'shell:protractor_install',
            'protractor_coverage:local',
            'makeReport'
        ]);
    });
};