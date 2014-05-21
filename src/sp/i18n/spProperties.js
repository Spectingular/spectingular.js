'use strict';

/**
 * @ngdoc service
 * @name sp.i18n.spProperties
 *
 * @description
 * Service that allows you to provide multi lingual support for properties that can be used
 * for labels etc.
 *
 * @example
 <example module="spPropertiesExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>1 in english</h3>
          {{enProperty}}
          <h3>1 in dutch</h3>
          {{nlProperty}}
       </div>
    </file>

    <file name="scripts.js">
       angular.module("spPropertiesExample", ['sp.i18n']).
          config(function(spPropertiesProvider) {
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                '1': 'one'
             }, 'en-us');
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                '1': 'een'
             }, 'nl-nl');
          }).
          controller('ctrl', function($scope, spProperties) {
             $scope.enProperty = spProperties.property('example', '1', 'en-us');
             $scope.nlProperty = spProperties.property('example', '1', 'nl-nl');
          });
 </file>
 </example>
 **/

angular.module('sp.i18n', ['sp.utility']).provider('spProperties', function () {
    /**
     * @ngdoc service
     * @name sp.i18n.spPropertiesProvider
     *
     * @description
     * Provider that allows you to add properties for a given identifier and locale.
     */
    this.propertyStore = {};

    /**
     * @ngdoc method
     * @name sp.i18n.spPropertiesProvider#add
     * @methodOf sp.i18n.spPropertiesProvider
     *
     * @description
     * Adds a property value for the given key and local matching the given identifier
     * @param {String} identifier The identifier that contains all the properties
     * @param {Object} properties The properties
     * @param {String} localeIdentifier The locale identifier
     */
    this.add = function (identifier, properties, localeIdentifier) {
        var propertyStore = this.propertyStore;
        if (angular.isUndefined(propertyStore[identifier])) {
            propertyStore[identifier] = {}
            propertyStore[identifier][localeIdentifier] = {};
        }
        if (angular.isUndefined(propertyStore[identifier][localeIdentifier])) {
            propertyStore[identifier][localeIdentifier] = {};
        }
        angular.forEach(properties, function (value, key) {
            propertyStore[identifier][localeIdentifier][key] = value;
        });
    }
    this.$get = ['spUtils', function (spUtils) {
        var propertyStore = this.propertyStore;
        return {
            /**
             * @ngdoc method
             * @name sp.i18n.spProperties#property
             * @methodOf sp.i18n.spProperties
             *
             * @description
             * Gets the property value for the key matching all the given criteria
             * @param {String} identifier The identifier that contains all the properties
             * @param {String} key The key
             * @param {String} localeIdentifier The locale identifier
             * @returns {String} value The value
             */
            property: function (identifier, key, localeIdentifier) {
                return spUtils.traverse(propertyStore, [identifier, localeIdentifier, key]);
            },
            /**
             * @ngdoc method
             * @name sp.i18n.spProperties#properties
             * @methodOf sp.i18n.spProperties
             *
             * @description
             * Gets the properties matching the identifier and locale identifier
             * @param {String} identifier The identifier that contains all the properties
             * @param {String} localeIdentifier The locale identifier
             * @returns {Array} valuesThe values
             */
            properties: function (identifier, localeIdentifier) {
                return spUtils.traverse(propertyStore, [identifier, localeIdentifier]);
            }
        };
    }];
});