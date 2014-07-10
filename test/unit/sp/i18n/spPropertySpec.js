'use strict';

describe('spProperty directive', function () {
    var element, scope;

    angular.module('sp.i18n').
        config(function (spPropertiesProvider) {
            spPropertiesProvider.add('example', mocks.properties.enUs, mocks.locales.enUs);
            spPropertiesProvider.add('example', mocks.properties.nlNl, mocks.locales.nlNl);
            spPropertiesProvider.add('example', mocks.properties.de, mocks.locales.de);
        });

    describe('using only the key attribute', function () {
        angular.module('spPropertyWithDefaultIdentifierAndLocale', ['sp.i18n']).config(function (spPropertyConfigProvider) {
            spPropertyConfigProvider.setDefaultIdentifier('example');
            spPropertyConfigProvider.setDefaultLocale('nl-nl');
        });

        beforeEach(function () {
            module('spPropertyWithDefaultIdentifierAndLocale');
            inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                element = angular.element(
                    '<span sp-property key="KEY_0004"></span>'
                );

                scope.who = 'Spectingular';
                $compile(element)(scope);
                scope.$digest();
            });
        });

        it('should be show the value for the given key', function () {
            expect(element.html()).toContain("Wat is je naam? Mijn naam is Spectingular");
        });
    });

    describe('using the key and identifier attribute', function () {
        angular.module('spPropertyWithDefaultLocale', ['sp.i18n']).config(function (spPropertyConfigProvider) {
            spPropertyConfigProvider.setDefaultLocale('nl-nl');
        });

        beforeEach(function () {
            module('spPropertyWithDefaultLocale');
            inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                element = angular.element(
                    '<span sp-property key="KEY_0004" identifier="example"></span>'
                );

                scope.who = 'Spectingular';
                $compile(element)(scope);
                scope.$digest();
            });
        });

        it('should be show the value for the given key and identifier', function () {
            expect(element.html()).toContain("Wat is je naam? Mijn naam is Spectingular");
        });
    });

    describe('using the key, identifier and locale attribute', function () {
        angular.module('spPropertyWithoutDefaults', ['sp.i18n']);
        beforeEach(function () {
            module('spPropertyWithoutDefaults');
            inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                element = angular.element(
                    '<span sp-property key="KEY_0004" identifier="example" locale="nl-nl"></span>'
                );

                scope.who = 'Spectingular';
                $compile(element)(scope);
                scope.$digest();
            });
        });

        it('should be show the value for the given key and identifier', function () {
            expect(element.html()).toContain("Wat is je naam? Mijn naam is Spectingular");
        });
    });

    describe('using only the key attribute and no defaults', function () {
        beforeEach(function () {
            module('sp.i18n');
            inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                element = angular.element(
                    '<span sp-property key="KEY_0004"></span>'
                );

                scope.who = 'Spectingular';
                $compile(element)(scope);
                scope.$digest();
            });
        });

        it('should not show anything', function () {
            expect(element.html()).toBe('');
        });
    });

});