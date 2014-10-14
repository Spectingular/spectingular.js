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
                    var keyCombinations = handlers[options.type].elements[target].keyCombinations;

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