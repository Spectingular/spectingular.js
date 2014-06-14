'use strict';
var mocks = require('../../../mocks/sp/i18n/spPropertiesMock').mocks;

/* jasmine e2e specs for the wizard directive, */
describe('spProperty', function () {
    beforeEach(function() {
        browser.get('/test/protractor/sp/i18n/spProperty.html');
    })


    it('should show value matching the given key and default identifier and locale', function () {
        expect(element(by.id('key')).getText()).toBe('hello I am Spectingular');
    });

    it('should show value matching the given key and locale and default identifier', function () {
        expect(element(by.id('keyAndLocale')).getText()).toBe('hallo ik ben Spectingular');
    });

    it('should show value matching the given key and identifier and default locale', function () {
        expect(element(by.id('keyAndIdentifier')).getText()).toBe('hello I am Spectingular');
    });

    it('should show value matching the given key, identifier and locale', function () {
        expect(element(by.id('keyIdentifierAndLocale')).getText()).toBe('hallo ik ben Spectingular');
    });

    it('should show value matching the given key, identifier and non existing locale', function () {
        expect(element(by.id('nonExisting')).getText()).toBe('');
    });
});