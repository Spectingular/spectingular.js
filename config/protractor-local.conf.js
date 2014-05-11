var config = require('./protractor-shared.conf').config;

// run selenium by downloading selenium-standalone and running with java -jar selenium-standalone.....jar
config.seleniumAddress = 'http://localhost:4444/wd/hub';

config.specs = [
    'test/protractor/sp/**/*.js'
];

config.multiCapabilities = [
    {'browserName': 'firefox'},
    {'browserName': 'phantomjs'}
];

exports.config = config;