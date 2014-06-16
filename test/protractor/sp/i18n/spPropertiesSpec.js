'use strict';
var mocks = require('../../../mocks/sp/i18n/spPropertiesMock').spPropertiesMocks;

describe('spProperties', function () {
    beforeEach(function() {
        browser.get('/test/protractor/sp/i18n/spProperties.html');
    })

    var enUsProperties = element.all(by.css('#enUsProperties li'));
    var nlNlProperties = element.all(by.css('#nlNlProperties li'));
    var deProperties = element.all(by.css('#deProperties li'));

    function hasCorrectValues(elements, locale) {
        var properties = mocks.properties[locale];
        var i = 0;
        for (var key in  properties) {
            if (properties.hasOwnProperty(key)) {
                expect(elements.get(i).getText()).toBe('key [' + key + '] - value [' + properties[key] + ']');
                i++;
            }
        }
    }

    it('should be fetched for the given identifier and locale', function () {
        expect(enUsProperties.count()).toBe(3);
        expect(nlNlProperties.count()).toBe(3);
        expect(deProperties.count()).toBe(3);
    });

    it('should be fetched for the given identifier and locale and have the correct values', function () {
        hasCorrectValues(enUsProperties, 'enUs');
        hasCorrectValues(nlNlProperties, 'nlNl');
        hasCorrectValues(deProperties, 'de');
    });

    it('should be fetched for the given identifier, key and locale and have the correct values', function () {
        expect(element(by.id('enUsProperty-KEY-0001')).getText()).toBe('key [KEY-0001] - value [' + mocks.properties['enUs']['KEY_0001'] + ']');
        expect(element(by.id('nlNlProperty-KEY-0001')).getText()).toBe('key [KEY-0001] - value [' + mocks.properties['nlNl']['KEY_0001'] + ']');
        expect(element(by.id('deProperty-KEY-0001')).getText()).toBe('key [KEY-0001] - value [' + mocks.properties['de']['KEY_0001'] + ']');
    });

});