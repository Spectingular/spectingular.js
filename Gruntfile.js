"use strict";

/*global require, module, done, process */
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {}
    });

    grunt.registerTask('default', function () {
        grunt.task.run([
        ]);
    });
};