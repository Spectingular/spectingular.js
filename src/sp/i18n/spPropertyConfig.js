'use strict';

/**
 * @ngdoc service
 * @name sp.i18n.spPropertyConfig
 *
 * @description
 * Provider that provides the default options for the spProperty directive.
 * It also allows you to override the defaults.
 *
 * @Usage
 * angular.module('myModule', []).config(function(spPropertyConfigProvider) {
 *      spPropertyConfigProvider.setDefaultIdentifier('example');
 *  })
 */
angular.module('sp.i18n').provider('spPropertyConfig', function () {
    /**
     * @ngdoc service
     * @name sp.i18n.spPropertyConfigProvider
     *
     * @description
     * Provider that allows you to override default options.
     */
    this.defaultOptions = {
        identifier: undefined
    };

    /**
     * @ngdoc method
     * @name sp.i18n.spPropertyConfigProvider#setDefaultIdentifier
     * @methodOf sp.i18n.spPropertyConfigProvider
     *
     * @description
     * Override the default identifier for which the spProperty will get the properties
     * @param {String} identifier The identifier.
     */
    this.setDefaultIdentifier = function (identifier) {
        this.defaultOptions.identifier = identifier;
    };

    /**
     * @ngdoc method
     * @name sp.i18n.spPropertyConfigProvider#setDefaultLocale
     * @methodOf sp.i18n.spPropertyConfigProvider
     *
     * @description
     * Override the default locale for which the spProperty will get the properties
     * @param {String} locale The locale.
     */
    this.setDefaultLocale = function (locale) {
        this.defaultOptions.locale = locale;
    };

    this.$get = ['$locale', function ($locale) {
        var defaultOptions = this.defaultOptions;
        if (angular.isUndefined(defaultOptions.locale)) {
            defaultOptions.locale = $locale.id
        }
        return {
            /**
             * @ngdoc method
             * @name sp.i18n.spPropertyConfig#defaultIdentifier
             * @methodOf sp.i18n.spPropertyConfig
             *
             * @description
             * Gets the default identifier
             * @returns {Object} defaultIdentifier The default identifier
             */
            defaultIdentifier: defaultOptions.identifier,
            /**
             * @ngdoc method
             * @name sp.i18n.spPropertyConfig#defaultLocale
             * @methodOf sp.i18n.spPropertyConfig
             *
             * @description
             * Gets the default locale
             * @returns {Object} defaultLocale The default locale
             */
            defaultLocale: defaultOptions.locale
        }
    }];
});