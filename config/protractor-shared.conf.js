var grunt = require('grunt');
var allScriptsTimeout = 11000;

exports.config = {
    allScriptsTimeout: allScriptsTimeout,

    baseUrl: 'http://localhost:11000/',

    framework: 'jasmine',

    params: {
        environment: 'BUILD',
        dependencyPath: './bower_components'
    },

    onPrepare: function() {
        require('jasmine-reporters');
        mkdirp = require('mkdirp')
        // Store the name of the browser that's currently being used.
        browser.getCapabilities().then(function(caps) {
            browser.params.browser = caps.get('browserName');
            
            var directory = 'results/protractor/' + browser.params.browser;
            mkdirp(directory, function (err) {
                if (err) {
                    throw new Error('Could not create directory ' + directory);
                }
            });
            jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(directory, true, true));
            browser.driver.manage().window().maximize();
            browser.manage().timeouts().setScriptTimeout(allScriptsTimeout);
        });
    },
    onCleanUp: function () {
    },
    beforeLaunch: function() {
    },
    afterLaunch: function () {
        var resultsBaseDir = path.join(exports.config.configDir, '..') + '/results/protractor/';
        grunt.file.expand({filter: 'isDirectory', cwd: resultsBaseDir}, '*').forEach(function (dir) {
            var mergedAndUpdatedContent = '<?xml version="1.0"?>\n<testsuites>\n';
            var errors = 0;
            var tests = 0;
            var failures = 0;
            var time = 0;

            var testcases = '';

            grunt.file.expand(resultsBaseDir + dir + '/*').forEach(function (file) {
                var content = grunt.file.read(file);
                var testsuites = content.match(/\<testsuite\s.*\>/g);

                for (var i = 0; i < testsuites.length; i++) {
                    var match = /\errors="(\d*)".*tests="(\d*)".*failures="(\d*)".*time="(.*)".*timestamp/g.exec(testsuites[i]);
                    errors = errors + Number(match[1]);
                    tests = tests + Number(match[2]);
                    failures = failures + Number(match[3]);
                    time = time + Number(match[4]);
                }

                content = content.replace(/\<\?xml.+\?\>/gm, '');
                content = content.replace(/\<testsuites>/gm, '');
                content = content.replace(/\<testsuite.*>/gm, '');
                content = content.replace(/\<\/testsuite>/gm, '');
                content = content.replace(/\<\/testsuites>/gm, '');
                testcases = testcases.concat(content);
            });

            var testsuite = '<testsuite ' +
                'name="' + dir + '" ' +
                'package="protractor" ' +
                'tests="' + tests + '" ' +
                'errors="' + errors + '" ' +
                'failures="' + failures + '" ' +
                'time="' + time + '">';
            mergedAndUpdatedContent = mergedAndUpdatedContent.concat(testsuite);
            mergedAndUpdatedContent = mergedAndUpdatedContent.concat(testcases);
            mergedAndUpdatedContent = mergedAndUpdatedContent.concat('</testsuite>');
            mergedAndUpdatedContent = mergedAndUpdatedContent.concat('</testsuites>');
            mergedAndUpdatedContent = mergedAndUpdatedContent.replace(/^\s*[\r\n]/gm, "");
            grunt.file.write(resultsBaseDir + '/protractor-' + dir + '.xml', mergedAndUpdatedContent);
        });
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 40000
    }
};