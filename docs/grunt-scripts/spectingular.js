angular.module('sp.utility', []);
angular.module('sp.i18n', ['sp.utility']);
angular.module('sp.binding', []);
'use strict';

/**
 * @ngdoc directive
 * @name sp.binding.directive:spBindOnce
 *
 * @description
 * Directive for handling one way binding, by destroying the scope within.
 *
 * @example
 <example module="spBindExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>one way binding</h3>
          <span sp-bind-once>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span>
          <h3>two way binding</h3>
          <span>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span><br />
          <h3>change</h3>
          value 1: <input type="text" ng-model="model.value1" /><br />
          value 2: <input type="text" ng-model="model.value2" />
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spBindExample', ['sp.binding']).
          controller('ctrl', function($scope) {
             $scope.model = {
                value1 : 'original value 1',
                value2 : 'original value 2'
             };
          });
    </file>
 </example>
 **/

angular.module('sp.binding').directive('spBindOnce', ['$timeout', function ($timeout) {
    return {
        scope: true,
        link: function (scope) {
            $timeout(function () {
                scope.$destroy();
            }, 0);
        }
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name sp.i18n.spProperties
 *
 * @description
 * Provider that allows you to provide multi lingual support for properties that can be used
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

angular.module('sp.i18n').provider('spProperties', function () {
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
'use strict';

/**
 * @ngdoc directive
 * @name sp.i18n.directive:spProperty
 *
 * @description
 * Directive for displaying properties from the {@link sp.i18n.spProperties} service.
 *
 * @param {String} key The property key to display
 * @param {String=} identifier The properties identifier
 * @param {String=} locale The locale
 *
 * @example
 <example module="spPropertyExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>Using attributes identifier [`example`], key [`welcome-message`] and locale [`nl-nl`]</h3>
          <div sp-property identifier='example' key='welcome-message' locale='nl-nl'></div>
          <h3>Using attributes identifier [`example`], key [`welcome-message`] and the default locale</h3>
          <div sp-property identifier='example' key='welcome-message'></div>
          <h3>Using attribute key [`welcome-message`] and the default locale and identifier</h3>
          <div sp-property key='welcome-message'></div>
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spPropertyExample', ['sp.i18n']).
          config(function(spPropertiesProvider, spPropertyConfigProvider) {
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                'welcome-message': 'hello I am {{who}}'
             }, 'en-us');
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                'welcome-message': 'hallo ik ben {{who}}'
             }, 'nl-nl');
             spPropertyConfigProvider.setDefaultIdentifier('example');
          }).
          controller('ctrl', function($scope) {
             $scope.who = 'Spectingular';
          });
    </file>
 </example>
 **/
angular.module('sp.i18n').directive('spProperty', ['spProperties', 'spPropertyConfig', '$compile', function (spProperties, spPropertyConfig, $compile) {
    return {
        restrict: 'EA',
        scope: false,
        link: function (scope, element, attrs) {
            var identifier = angular.isDefined(attrs.identifier) ? attrs.identifier : spPropertyConfig.defaultIdentifier;
            var locale = angular.isDefined(attrs.locale) ? attrs.locale : spPropertyConfig.defaultLocale;

            element.html(spProperties.property(identifier, attrs.key, locale));
            $compile(element.contents())(scope);
        }
    };
}]);
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
'use strict';

/**
 * @ngdoc service
 * @name sp.utility.spUtils
 *
 * @description
 * Service that provides utility functions such as safe object traversal.
 **/
angular.module('sp.utility').service('spUtils', function () {
    var fn = {};

    /**
     * @ngdoc method
     * @name sp.utility.spUtils#traverse
     * @methodOf sp.utility.spUtils
     * @param {Object} object The object to traverse
     * @param {Array} path Array of string
     * @example
     <example module="spUtilsExample">
     <file name="index.html">
     <div ng-controller="ctrl">
     <h3>Existing Path</h3>
     {{result}}
     <h3>Non-existing path</h3>
     {{resultWithoutDefault}}
     <h3>Non-existing path with default</h3>
     {{resultWithDefault}}
     </div>
     </file>

     <file name="scripts.js">
     angular.module("spUtilsExample", ['sp.utility']).
     controller('ctrl', function($scope, spUtils) {
             var obj = {
                'foo': {
                    'bar': "restaurant"
                }
             };
             $scope.result                = spUtils.traverse(obj, ['foo', 'bar']);
             $scope.resultWithoutDefault  = spUtils.traverse(obj, ['foo', 'baz']);
             $scope.resultWithDefault     = spUtils.traverseOrDefault(obj, ['foo', 'baz'], "someDefaultValue");
          });
     </file>
     </example>
     */
    function traverse(object, path) {
        if (path.length === 0) {
            return object;
        } else {
            var head  = path.shift(),
                child = object[head];
            return angular.isDefined(child) ? traverse(child, path) : undefined;
        }
    }

    fn.traverse = traverse;

    fn.traverseOrDefault = function (object, path, defaultValue) {
        var result = fn.traverse(object, path);
        return angular.isDefined(result) ? result : defaultValue;
    };

    return fn;
});