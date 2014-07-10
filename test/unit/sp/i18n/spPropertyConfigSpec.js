'use strict';

describe('spPropertyConfig provider', function () {

    var config; // the config to test
    var locale;

    describe('using default settings', function () {
        angular.module("defaultPropertyConfig", ['sp.i18n']);
        beforeEach(function () {
            module('defaultPropertyConfig');
            inject(function (spPropertyConfig, $locale) {
                config = spPropertyConfig;
                locale = $locale
            });
        });

        it('should not have an identifier', function () {
            expect(config.defaultIdentifier).toBeUndefined();
        });
        it('should set the default locale', function () {
            expect(config.defaultLocale).toBe(locale.id);
        })
    });

    describe('using override settings', function () {
        angular.module("overridePropertyConfig", ['sp.i18n']).
            config(function (spPropertyConfigProvider) {
                spPropertyConfigProvider.setDefaultIdentifier('example');
                spPropertyConfigProvider.setDefaultLocale('nl-nl');
            });
        beforeEach(function () {
            module('overridePropertyConfig');
            inject(function (spPropertyConfig, $locale) {
                config = spPropertyConfig;
                locale = $locale
            });
        });

        it('should not have an identifier', function () {
            expect(config.defaultIdentifier).toBe('example');
        });
        it('should set the default locale', function () {
            expect(config.defaultLocale).toBe('nl-nl');
        })
    });
});