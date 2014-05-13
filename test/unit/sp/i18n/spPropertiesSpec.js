'use strict';

describe('properties', function () {

    var service; // the service to test

    angular.module("prop1", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier1', mocks.properties.enUs, mocks.locales.enUs);
            spPropertiesProvider.add('identifier1', mocks.properties.nlNl, mocks.locales.nlNl);
        });

    angular.module("prop2", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier2', mocks.properties.de, mocks.locales.de);
        });

    angular.module("prop3", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier3', mocks.properties.enUs, mocks.locales.enUs);
            spPropertiesProvider.add('identifier3', mocks.properties.nlNl, mocks.locales.nlNl);
            spPropertiesProvider.add('identifier3', mocks.properties.de, mocks.locales.de);
        });

    angular.module("prop", ['prop1', 'prop2', 'prop3']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier3', {'KEY_0003': mocks.overrides.enUs}, mocks.locales.enUs);
            spPropertiesProvider.add('identifier3', {'KEY_0003': mocks.overrides.nlNl}, mocks.locales.nlNl);
            spPropertiesProvider.add('identifier3', {'KEY_0003': mocks.overrides.de}, mocks.locales.de);
        });

    beforeEach(function () {
        module('prop');
        inject(function (spProperties) {
            service = spProperties;
        });
    });

    it('should be fetched for the given identifier and locale', function () {
        expect(service.properties('identifier1', mocks.locales.enUs)).toEqual(mocks.properties.enUs);
        expect(service.properties('identifier1', mocks.locales.nlNl)).toEqual(mocks.properties.nlNl);
        expect(service.properties('identifier2', mocks.locales.de)).toEqual(mocks.properties.de);
    });
    it('should be fetched for the given identifier and locale but not match as they are overridden', function () {
        expect(service.properties('identifier3', mocks.locales.enUs)).not.toEqual(mocks.properties.enUs);
        expect(service.properties('identifier3', mocks.locales.nlNl)).not.toEqual(mocks.properties.nlNl)
        expect(service.properties('identifier3', mocks.locales.de)).not.toEqual(mocks.properties.de)
    });
    it('should be fetched for the given identifier, key and locale', function () {
        expect(service.property('identifier1', 'KEY_0001', mocks.locales.enUs)).toEqual('one');
        expect(service.property('identifier1', 'KEY_0001', mocks.locales.nlNl)).toEqual('&eacute;&eacute;n');
        expect(service.property('identifier2', 'KEY_0001', mocks.locales.de)).toEqual('eins');
    });
    it('should be fetched for the given identifier, key and locale but match the overridden values', function () {
        expect(service.property('identifier3', 'KEY_0003', mocks.locales.enUs)).toEqual('override');
        expect(service.property('identifier3', 'KEY_0003', mocks.locales.nlNl)).toEqual('overschrijven');
        expect(service.property('identifier3', 'KEY_0003', mocks.locales.de)).toEqual('&uuml;berschreiben');
    });
});