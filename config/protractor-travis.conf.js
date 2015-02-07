var config = require('./protractor-shared.conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.specs = [
    'test/protractor/sp/**/*.js'
];

config.multiCapabilities = [{
    'browserName': 'chrome',
    'name': 'Spectingular Protractor',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'shardTestFiles': true,
    'maxInstances': 10
}, {
    'browserName': 'firefox',
    'name': 'Spectingular Protractor',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'version': '35',
    'shardTestFiles': true,
    'maxInstances': 10
}, {
    browserName: 'safari',
    'platform': 'OS X 10.9',
    'version': '7',
    'name': 'Spectingular Protractor',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'shardTestFiles': true,
    'maxInstances': 10
}];


exports.config = config;