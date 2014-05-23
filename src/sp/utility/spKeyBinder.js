"use strict";

/**
 * @ngdoc service
 * @name sp.utility.keyBinder
 *
 * @description
 * Service that handles all key bindings and takes care of registring and unregistering the handlers.
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
                if (angular.isUndefined(service.handlers[options.type])) { // no handler for the given type has been registered yet.
                    element.on(options.type, function (event) { // do the actual binding
                        var keyCombinations = service.handlers[options.type].keyCombinations;
                        // iterate through each key combination that has been registered for the given type.
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
                            var specialKey = keys.length === 1 ?spKeyBinderConfig.specialKeys()[kc] : undefined;
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
                    service.handlers[options.type] = {};
                    service.handlers[options.type].count = 1;
                    service.handlers[options.type].keyCombinations = {};
                    service.handlers[options.type].keyCombinations[keyCombination] = 1;
                } else {
                    // register the key combination for the given type.
                    if (angular.isUndefined(service.handlers[options.type].keyCombinations[keyCombination])) {
                        service.handlers[options.type].keyCombinations[keyCombination] = 1;
                    } else { // increment the counter for the given key combination.
                        service.handlers[options.type].keyCombinations[keyCombination]++;
                    }
                    service.handlers[options.type].count++;
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
                if (service.handlers[options.type]) { // only unbind if the type is registered
                    service.handlers[options.type].count--;
                    service.handlers[options.type].keyCombinations[keyCombination]--;
                    // delete if there are no other bindings for the given key combination
                    if (service.handlers[options.type].keyCombinations[keyCombination] === 0) {
                        delete service.handlers[options.type].keyCombinations[keyCombination];
                    }
                    // delete object and unbind the event, if there are no other bindings for the given type
                    if (service.handlers[options.type].count === 0) {
                        element.off(options.type);
                        delete  service.handlers[options.type];
                    }
                }
            });
        }
    }
    return service;
}]);