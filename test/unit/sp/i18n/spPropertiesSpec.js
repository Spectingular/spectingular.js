'use strict';

describe('properties', function () {

    var service; // the service to test

    angular.module("prop1", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier1', spPropertiesMocks.properties.enUs, spPropertiesMocks.locales.enUs);
            spPropertiesProvider.add('identifier1', spPropertiesMocks.properties.nlNl, spPropertiesMocks.locales.nlNl);
        });

    angular.module("prop2", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier2', spPropertiesMocks.properties.de, spPropertiesMocks.locales.de);
        });

    angular.module("prop3", ['sp.i18n']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier3', spPropertiesMocks.properties.enUs, spPropertiesMocks.locales.enUs);
            spPropertiesProvider.add('identifier3', spPropertiesMocks.properties.nlNl, spPropertiesMocks.locales.nlNl);
            spPropertiesProvider.add('identifier3', spPropertiesMocks.properties.de, spPropertiesMocks.locales.de);
        });

    angular.module("prop", ['prop1', 'prop2', 'prop3']).
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('identifier3', {'KEY_0003': spPropertiesMocks.overrides.enUs}, spPropertiesMocks.locales.enUs);
            spPropertiesProvider.add('identifier3', {'KEY_0003': spPropertiesMocks.overrides.nlNl}, spPropertiesMocks.locales.nlNl);
            spPropertiesProvider.add('identifier3', {'KEY_0003': spPropertiesMocks.overrides.de}, spPropertiesMocks.locales.de);
        });

    beforeEach(function () {
        module('prop');
        inject(function (spProperties) {
            service = spProperties;
        });
    });

    it('should be fetched for the given identifier and locale', function () {
        expect(service.properties('identifier1', spPropertiesMocks.locales.enUs)).toEqual(spPropertiesMocks.properties.enUs);
        expect(service.properties('identifier1', spPropertiesMocks.locales.nlNl)).toEqual(spPropertiesMocks.properties.nlNl);
        expect(service.properties('identifier2', spPropertiesMocks.locales.de)).toEqual(spPropertiesMocks.properties.de);
    });
    it('should be fetched for the given identifier and locale but not match as they are overridden', function () {
        expect(service.properties('identifier3', spPropertiesMocks.locales.enUs)).not.toEqual(spPropertiesMocks.properties.enUs);
        expect(service.properties('identifier3', spPropertiesMocks.locales.nlNl)).not.toEqual(spPropertiesMocks.properties.nlNl)
        expect(service.properties('identifier3', spPropertiesMocks.locales.de)).not.toEqual(spPropertiesMocks.properties.de)
    });
    it('should be fetched for the given identifier, key and locale', function () {
        expect(service.property('identifier1', 'KEY_0001', spPropertiesMocks.locales.enUs)).toEqual('one');
        expect(service.property('identifier1', 'KEY_0001', spPropertiesMocks.locales.nlNl)).toEqual('&eacute;&eacute;n');
        expect(service.property('identifier2', 'KEY_0001', spPropertiesMocks.locales.de)).toEqual('eins');
    });
    it('should be fetched for the given identifier, key and locale but match the overridden values', function () {
        expect(service.property('identifier3', 'KEY_0003', spPropertiesMocks.locales.enUs)).toEqual('override');
        expect(service.property('identifier3', 'KEY_0003', spPropertiesMocks.locales.nlNl)).toEqual('overschrijven');
        expect(service.property('identifier3', 'KEY_0003', spPropertiesMocks.locales.de)).toEqual('&uuml;berschreiben');
    });
    it('should give undefined for undefined entries', function () {
        expect(service.property('identifier', 'KEY_0001', spPropertiesMocks.locales.enUs)).toBeUndefined();
        expect(service.property('identifier1', 'KEY', spPropertiesMocks.locales.enUs)).toBeUndefined();
        expect(service.property('identifier1', 'KEY_0001', "--")).toBeUndefined();
    })
});