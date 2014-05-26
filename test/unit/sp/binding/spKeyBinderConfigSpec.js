'use strict';

describe('spKeyBinderConfig provider', function () {
    var service, document;

    angular.module("defaultConfig", ['sp.binding']);

    angular.module("overrideConfig", ['sp.binding']).
        config(function (spKeyBinderConfigProvider) {
            spKeyBinderConfigProvider.setDefaultTarget('x');
            spKeyBinderConfigProvider.setDefaultType('keyup');
        });

    describe('using default options', function () {
        beforeEach(function () {
            module('defaultConfig');
            inject(function (spKeyBinderConfig, $document) {
                service = spKeyBinderConfig;
                document = $document
            });
        });

        it('should get the default options', function () {
            expect(service.defaultOptions().target).toBe(document);
            expect(service.defaultOptions().type).toBe('keydown');
        });
    })

    describe('using default options', function () {
        beforeEach(function () {
            module('overrideConfig');
            inject(function (spKeyBinderConfig) {
                service = spKeyBinderConfig;
            });
        });

        it('should get the override options', function () {
            expect(service.defaultOptions().target).toBe('x');
            expect(service.defaultOptions().type).toBe('keyup');
        });
    })

});
