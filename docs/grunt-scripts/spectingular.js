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
 * @ngdoc filter
 * @name sp.utility.filter:spTrusted
 *
 * @description
 * Filter for trusting html.
 *
 * @example
 <example module="spTrustedExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>trusted</h3>
          <div ng-bind-html="snippet | spTrusted"></div>
          <h3>untrusted</h3>
          <div ng-bind-html="snippet"></div>
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spTrustedExample', ['sp.utility']).
          controller('ctrl', function($scope) {
             $scope.snippet = '<p style="color:blue">an html\n<em onmouseover="this.textContent=\'PWN3D!\'">hover</em>\nsnippet</p>';
          });
 </file>
 </example>
 **/

angular.module('sp.utility')
    .filter('spTrusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
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