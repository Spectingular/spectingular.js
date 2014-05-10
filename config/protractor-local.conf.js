var config = require('./protractor-shared.conf').config;

config.seleniumServerJar = '../node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar';
config.seleniumPort = 4444;

config.specs = [
    'test/protractor/sp/**/*.js'
];

config.capabilities = {
    browserName: 'chrome'
};

config.chromeOnly = true;
config.chromeDriver = '../node_modules/protractor/selenium/chromedriver';

exports.config = config;