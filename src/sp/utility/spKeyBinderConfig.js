"use strict";

/**
 * @ngdoc service
 * @name sp.utility.spKeyBinderConfig
 *
 * @description
 * Service that provides the default options for the spKeyBinder. It also allows you to override
 * the defaults.

 */
angular.module('sp.utility').provider('spKeyBinderConfig',function () {
    /**
     * @ngdoc service
     * @name sp.utility.spKeyBinderConfigProvider
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
     * @name sp.utility.spKeyBinderConfigProvider#setDefaultTarget
     * @methodOf sp.utility.spKeyBinderConfigProvider
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
     * @name sp.utility.spKeyBinderConfigProvider#setDefaultType
     * @methodOf sp.utility.spKeyBinderConfigProvider
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
             * @name sp.utility.spKeyBinderConfig#defaultOptions
             * @methodOf sp.utility.spKeyBinderConfig
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
             * @name sp.utility.spKeyBinderConfig#specialKeys
             * @methodOf sp.utility.spKeyBinderConfig
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