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
"use strict";

/**
 * @ngdoc service
 * @name sp.binding.spKeyBinder
 * @requires sp.binding.spKeyBinderConfig
 *
 * @description
 * The `spKeyBinder` service is a utility service that facilitates the binding and unbinding
 * of key combination events to dom elements. It makes it possible to bind multiple key combinations to an key type and on multiple
 * elements.
 *
 * # General usage
 * The bind and unbind functions of the `spKeyBinder` service has:
 *
 * - one mandatory argument — the key combination
 * - two optional arguments
 *   - **`callback`** - a function that is triggered when the key combination on the element is entered
 *   - **`options`** - a configuration object that makes it possible to override the default options
 *
 * The `spKeyBinder` service is provided with default options from the `spKeyBinderConfig` provider.
 * By default the event type is `keydown`.
 *
 * The `spKeyBinder` can also be used without any key combination. If now key combination (undefined) is provided when binding, the key combination will be
 * **`mousedown`**.
 *
 * @example
 <example module="spKeyBinderExample">
 <file name="index.html">
 <div ng-controller="ctrl">
 <span>Pressing the escape key should trigger a broadcast event</span><br />
 <input type="text" id="x" placeholder="key combination ctrl+shift+x should trigger a broadcast event"/><br />
 <div id="y">Clicking here should trigger a broadcast event</div><br /><br />
 <h1>events</h1>
 <ul>
 <li ng-repeat="event in model.events track by $index">{{event}}</li>
 </ul>
 </div>
 </file>

 <file name="scripts.js">
 angular.module("spKeyBinderExample", ['sp.binding']).
 controller('ctrl', function($scope, spKeyBinder) {
             spKeyBinder.bind('escape');
             spKeyBinder.bind('ctrl+shift+x', function() {
                $scope.model.events.push('keydown-ctrl+shift+x');
                $scope.$apply();
             }, {
                target: 'x',
                type: 'keydown'
             });
             spKeyBinder.bind(undefined, undefined, {
                target: 'y',
                type: 'click'
             });

             $scope.model = {events: []};
             $scope.$on('keydown-escape', function(event) {
                $scope.model.events.push('keydown-escape');
                $scope.$apply();
             });
             $scope.$on('click', function(event) {
                $scope.model.events.push('click');
                $scope.$apply();
             });
          });
 </file>
 </example>
 */
angular.module('sp.binding').factory('spKeyBinder', ['$rootScope', '$document', 'spKeyBinderConfig', function ($rootScope, $document, spKeyBinderConfig) {
    var handlers = {};

    /**
     * Execute the callback with the correct information.
     * @param keyCombination The key combination to which the event will be bound.
     * @param options The options that need to be merged with the default options.
     * @param callback The callback function.
     */
    function execute(keyCombination, options, callback) {
        options = angular.extend({}, spKeyBinderConfig.defaultOptions(), options); // extend the options
        var element = angular.isString(options.target) ? angular.element(document.querySelector('#' + options.target)) : options.target;


        // check if a key combination was specified.
        if (angular.isUndefined(keyCombination)) {
            keyCombination = 'mousedown';
        }

        callback(keyCombination, options, element);
    }

    /**
     * @ngdoc method
     * @name sp.binding.spKeyBinder#bind
     * @methodOf sp.binding.spKeyBinder
     * @description Bind the key combination to the given target using the given options.
     * @param {string} keyCombination The key combination.
     * @param {function=} callback The callback that is executed when the entered key combination matches. If no callback function is provided, an event will be broadcast.
     * @param {Object=} options The options.
     */
    function bind(keyCombination, callback, options) {
        execute(keyCombination, options, function (keyCombination, options, element) {
            var target = options.target === $document ? 'document' : options.target;
            var bind = false;

            // check for type
            if (angular.isUndefined(handlers[options.type])) { // no handler for the given type has been registered yet
                handlers[options.type] = {
                    count: 0 // total number of bind registrations
                };
                handlers[options.type].elements = {};
            }

            // check for element
            if (angular.isUndefined(handlers[options.type].elements[target])) {
                bind = true;
                handlers[options.type].elements[target] = {
                    count: 0,
                    keyCombinations: {}
                };
            }

            // check for key combination
            if (angular.isUndefined(handlers[options.type].elements[target].keyCombinations[keyCombination])) {
                handlers[options.type].count++;
                handlers[options.type].elements[target].count++;
                handlers[options.type].elements[target].keyCombinations[keyCombination] = {}
                handlers[options.type].elements[target].keyCombinations[keyCombination].count = 1;
            } else {
                handlers[options.type].count++;
                handlers[options.type].elements[target].count++;
                handlers[options.type].elements[target].keyCombinations[keyCombination].count++;
            }
            handlers[options.type].elements[target].keyCombinations[keyCombination].callback = callback;

            if (bind) {
                element.on(options.type, function (event) { // do the actual binding
                    var origin = angular.isDefined(event.delegateTarget.id) ? event.delegateTarget.id : 'document';
                    var keyCombinations = handlers[options.type].elements[origin].keyCombinations;

                    for (var kc in keyCombinations) {
                        var keys = kc.split("+");
                        // check the pressed modifiers
                        var modifiers = {
                            shift: keys.indexOf('shift') > -1,
                            ctrl: keys.indexOf('ctrl') > -1,
                            alt: keys.indexOf('alt') > -1
                        };

                        // remove modifiers
                        if( keys.indexOf('shift') > -1) {
                            keys.splice(keys.indexOf('shift'), 1)
                        }
                        if( keys.indexOf('ctrl') > -1) {
                            keys.splice(keys.indexOf('ctrl'), 1)
                        }
                        if( keys.indexOf('alt') > -1) {
                            keys.splice(keys.indexOf('alt'), 1)
                        }

                        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : undefined;
                        var character = String.fromCharCode(keyCode).toLowerCase();
                        var specialKey = spKeyBinderConfig.specialKeys()[keys];

                        // broadcast the event if the key combination matches
                        if ((modifiers.shift === (event.shiftKey ? true : false)) && // do we require shift and is it pressed?
                            (modifiers.ctrl === (event.ctrlKey ? true : false)) && // do we require ctrl and is it pressed?
                            (modifiers.alt === (event.altKey ? true : false)) && // do we require alt and is it pressed?
                            (
                                keys.indexOf(character) > -1 || // does the character match
                                    (angular.isDefined(specialKey) && specialKey === keyCode)) // or does it match a special key
                            ) {

                            if(angular.isDefined(handlers[options.type].elements[target].keyCombinations[kc].callback)) {
                                handlers[options.type].elements[target].keyCombinations[kc].callback();
                            } else {
                                var eventName = event.type;
                                // if we have a defined a key combination append it to the event name.
                                if (keyCode !== 1) {
                                    eventName = eventName + '-' + kc;
                                }
                                $rootScope.$broadcast(eventName);
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * @ngdoc method
     * @name sp.binding.spKeyBinder#unbind
     * @methodOf sp.binding.spKeyBinder
     * @description Unbind the event to the given target for the given key combination.
     * @param {string} keyCombination The key combination.
     * @param {Object=} options The options.
     */
    function unbind(keyCombination, options) {
        execute(keyCombination, options, function (keyCombination, options, element) {
            var target = options.target === $document ? 'document' : options.target;

            if (angular.isDefined(handlers[options.type]) &&
                angular.isDefined(handlers[options.type].elements[target]) &&
                angular.isDefined(handlers[options.type].elements[target].keyCombinations[keyCombination].count)) {

                handlers[options.type].elements[target].keyCombinations[keyCombination].count--;
                handlers[options.type].elements[target].count--;
                handlers[options.type].count--;

                if (handlers[options.type].elements[target].keyCombinations[keyCombination].count === 0) {
                    delete handlers[options.type].elements[target].keyCombinations[keyCombination];
                }
                if (handlers[options.type].elements[target].count === 0) {
                    delete handlers[options.type].elements[target];
                    element.off(options.type);
                }
                if (handlers[options.type].count === 0) {
                    delete  handlers[options.type];
                }

            }
        });
    }

    return {
        handlers: handlers,
        bind: bind,
        unbind: unbind
    };
}]);
"use strict";

/**
 * @ngdoc service
 * @name sp.binding.spKeyBinderConfig
 *
 * @description
 * Service that provides the default options for the spKeyBinder. It also allows you to override
 * the defaults.

 */
angular.module('sp.binding').provider('spKeyBinderConfig',function () {
    /**
     * @ngdoc service
     * @name sp.binding.spKeyBinderConfigProvider
     *
     * @description
     * Provider that allows you to override default options.
     */
    this.defaultOptions = {
        'type': 'keydown'
    };

    this.specialKeys = {
        'mousedown': 1,
        'backspace': 8,
        'tab': 9,
        'enter': 13,
        'break': 19,
        'capslock': 20,
        'escape': 27,
        'space': 32,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'insert': 45,
        'delete': 46,
        'numlock': 144,
        'scroll': 145,
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    };
    /**
     * @ngdoc method
     * @name sp.binding.spKeyBinderConfigProvider#setDefaultTarget
     * @methodOf sp.binding.spKeyBinderConfigProvider
     *
     * @description
     * Override the default target to which the spKeyBinder will register the events.
     * @param {String} target The target.
     */
    this.setDefaultTarget = function (target) {
        this.defaultOptions.target = target;
    };
    /**
     * @ngdoc method
     * @name sp.binding.spKeyBinderConfigProvider#setDefaultType
     * @methodOf sp.binding.spKeyBinderConfigProvider
     *
     * @description
     * Override the default type to which the event will be bound.
     * @param {String} type The type
     */
    this.setDefaultType = function (type) {
        this.defaultOptions.type = type;
    }

    this.$get = ['$document', function ($document) {
        var defaultOptions = this.defaultOptions;
        var specialKeys = this.specialKeys;
        if (angular.isUndefined(defaultOptions.target)) {
            defaultOptions.target = $document; // set the default target to $document.
        }
        return {
            /**
             * @ngdoc method
             * @name sp.binding.spKeyBinderConfig#defaultOptions
             * @methodOf sp.binding.spKeyBinderConfig
             *
             * @description
             * Gets the spKeyBinder default options
             * @returns {Object} defaultOptions The default options
             */
            defaultOptions: function () {
                return defaultOptions;
            },
            /**
             * @ngdoc method
             * @name sp.binding.spKeyBinderConfig#specialKeys
             * @methodOf sp.binding.spKeyBinderConfig
             *
             * @description
             * Gets the spKeyBinder special keys
             * @returns {Object} specialKeys The special keys
             */
            specialKeys: function () {
                return specialKeys;
            }
        }
    }];
})
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