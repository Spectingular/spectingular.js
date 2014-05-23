"use strict";

/**
 * @ngdoc service
 * @name sp.utility.keyBinder
 *
 * @description
 * Service that handles all key bindings and takes care of registring and unregistering the handlers.
 *
 * @example
 <example module="spKeyBinderExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <span>Pressing the escape key should trigger a broadcast event</span><br />
          <input type="text" id="x" placeholder="key combination ctrl+shift+x should trigger a broadcast event"/><br />
          <div id="y">Clicking here should trigger a broadcast event</div><br /><br />
          <h1>events</h1>
                {{model.events}}
//          <ul>
//            <li ng-repeat="event in events">{{event}}</li>
//          </ul>
       </div>
    </file>

    <file name="scripts.js">
       angular.module("spKeyBinderExample", ['sp.utility']).
          controller('ctrl', function($rootScope, $scope, spKeyBinder) {
             spKeyBinder.bind('escape');
             spKeyBinder.bind('ctrl+shift+x', {
                target: 'x',
                type: 'keydown'
             });
             spKeyBinder.bind(undefined, {
                target: 'y',
                type: 'click'
             });
             $scope.model = {events: []};
             $rootScope.$on('keydown-escape', function(event) {
                $scope.model.events.push('keydown-escape');
             });
             $rootScope.$on('keydown-ctrl+shift+x', function(event) {
                $scope.model.events.push('keydown-ctrl+shift+x');
             });
             $rootScope.$on('click', function(event) {
                $scope.model.events.push('click');
             });
          });
 </file>
 </example>
 */
angular.module('sp.utility').factory('spKeyBinder', ['$rootScope', '$document', 'spKeyBinderConfig', function ($rootScope, $document, spKeyBinderConfig) {
    /**
     * Execute the callback with the correct information.
     * @param keyCombination The key combination to which the event will be bound.
     * @param options The options that need to be merged with the default options.
     * @param callback The callback function.
     */
    var execute = function (keyCombination, options, callback) {
        options = angular.extend({}, spKeyBinderConfig.defaultOptions(), options); // extend the options
        var element = angular.isString(options.target) ? angular.element(document.querySelector('#' + options.target)) : options.target;


        // check if a key combination was specified.
        if (angular.isUndefined(keyCombination)) {
            keyCombination = 'mousedown';
        }

        callback(keyCombination, options, element);
    };

    /**
     * The actual service.
     * @type {{handlers: {}, bind: bind, unbind: unbind}}
     */
    var service = {
        handlers: {},
        /**
         * Bind the event to the given target for the given key combination.
         * @param keyCombination The key combination.
         * @param options The options.
         */
        bind: function (keyCombination, options) {
            execute(keyCombination, options, function (keyCombination, options, element) {
                var target = options.target === $document ? 'document' : options.target;
                var bind = false;

                // check for type
                if (angular.isUndefined(service.handlers[options.type])) { // no handler for the given type has been registered yet
                    service.handlers[options.type] = {
                        count: 0 // total number of bind registrations
                    };
                    service.handlers[options.type].elements = {};
                }

                // check for element
                if(angular.isUndefined(service.handlers[options.type].elements[target])) {
                    bind = true;
                    service.handlers[options.type].elements[target] = {
                        count: 0,
                        keyCombinations : {}
                    };
                }

                // check for key combination
                if(angular.isUndefined(service.handlers[options.type].elements[target].keyCombinations[keyCombination])) {
                    service.handlers[options.type].count++;

                    service.handlers[options.type].elements[target].count++;
                    service.handlers[options.type].elements[target].keyCombinations[keyCombination] = 1;
                } else {
                    service.handlers[options.type].count++;
                    service.handlers[options.type].elements[target].count++;
                    service.handlers[options.type].elements[target].keyCombinations[keyCombination]++;
                }

                if(bind) {
                    element.on(options.type, function (event) { // do the actual binding
                        var origin = angular.isDefined(event.delegateTarget.id) ? event.delegateTarget.id : 'document';
                        var keyCombinations = service.handlers[options.type].elements[origin].keyCombinations;

                        for (var kc in keyCombinations) {
                            var keys = kc.split("+");
                            // check the pressed modifiers
                            var modifiers = {
                                shift: keys.indexOf('shift') > -1,
                                ctrl: keys.indexOf('ctrl') > -1,
                                alt: keys.indexOf('alt') > -1
                            };
                            var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : undefined;
                            var character = String.fromCharCode(keyCode).toLowerCase();
                            var specialKey = keys.length === 1 ? spKeyBinderConfig.specialKeys()[kc] : undefined;
                            // broadcast the event if the key combination matches
                            if ((modifiers.shift === (event.shiftKey ? true : false)) && // do we require shift and is it pressed?
                                (modifiers.ctrl === (event.ctrlKey ? true : false)) && // do we require ctrl and is it pressed?
                                (modifiers.alt === (event.altKey ? true : false)) && // do we require alt and is it pressed?
                                (
                                    keys.indexOf(character) > -1 || // does the character match
                                        (angular.isDefined(specialKey) && specialKey === keyCode)) // or does it match a special key
                                ) {

                                var eventName = event.type;
                                // if we have a defined a key combination append it to the event name.
                                if (keyCode !== 1) {
                                    eventName = eventName + '-' + kc;
                                }
                                $rootScope.$broadcast(eventName);
                            }
                        }
                    });
                }
            });
        },
        /**
         * Unbind the event to the given target for the given key combination.
         * @param keyCombination The key combination.
         * @param options The options.
         */
        unbind: function (keyCombination, options) {
            execute(keyCombination, options, function (keyCombination, options, element) {
                var target = options.target === $document ? 'document' : options.target;

                if (angular.isDefined(service.handlers[options.type]) &&
                    angular.isDefined(service.handlers[options.type].elements[target]) &&
                    angular.isDefined(service.handlers[options.type].elements[target].keyCombinations[keyCombination])) {

                    service.handlers[options.type].elements[target].keyCombinations[keyCombination]--;
                    service.handlers[options.type].elements[target].count--;
                    service.handlers[options.type].count--;

                    if(service.handlers[options.type].elements[target].keyCombinations[keyCombination] === 0) {
                        delete service.handlers[options.type].elements[target].keyCombinations[keyCombination];
                    }
                    if(service.handlers[options.type].elements[target].count === 0) {
                        delete service.handlers[options.type].elements[target];
                        element.off(options.type);
                    }
                    if (service.handlers[options.type].count === 0) {
                        delete  service.handlers[options.type];
                    }
                }
            });
        }
    }
    return service;
}]);