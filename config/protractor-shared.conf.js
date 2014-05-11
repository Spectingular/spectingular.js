var grunt = require('grunt');

exports.config = {
    allScriptsTimeout: 11000,

    baseUrl: 'http://localhost:11000/',

    framework: 'jasmine',

    onPrepare: function() {
        // Store the name of the browser that's currently being used.
        browser.getCapabilities().then(function(caps) {
            browser.params.browser = caps.get('browserName');
        });

        require('jasmine-reporters');
        mkdirp = require('mkdirp')

        mkdirp('results/protractor/' + browser.params.browser, function (err) {
            if (err) {
                throw new Error('Could not create directory ' + directory);
            }
        });
        jasmine.getEnv().addReporter(
            new jasmine.JUnitXmlReporter('results/protractor/' + browser.params.browser, true, true));
    },
    onCleanUp: function () {
        var mergedAndUpdatedContent = '<?xml version="1.0"?>\n<testsuites>\n';
        var errors = 0;
        var tests = 0;
        var failures = 0;
        var time = 0;


        var testcases = '';
        grunt.file.expand('results/protractor/' + browser.params.browser + '/*').forEach(function (file) {
            var content = grunt.file.read(file);

            var match = /\<testsuite.*errors="(\d*)".*tests="(\d*)".*failures="(\d*)".*time="(.*)".*timestamp.*>/g;
            var match = match.exec(content);

            errors = errors + Number(match[1]);
            tests = tests + Number(match[2]);
            failures = failures + Number(match[3]);
            time = time + Number(match[4]);

            content = content.replace(/\<\?xml.+\?\>/gm, '');
            content = content.replace(/\<testsuites>/gm, '');
            content = content.replace(/\<testsuite.*>/gm, '');
            content = content.replace(/\<\/testsuite>/gm, '');
            content = content.replace(/\<\/testsuites>/gm, '');
            testcases = testcases.concat(content);
        })

        var testsuite = '<testsuite ' +
            'name="' + browser.params.browser + '" ' +
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
        grunt.file.write('results/protractor/protractor-' + browser.params.browser + '.xml', mergedAndUpdatedContent);
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 2000
    }
};