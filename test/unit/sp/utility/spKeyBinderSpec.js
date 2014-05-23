'use strict';

describe('spKeyBinder service', function () {
    var rootScope, scope, service, document, element, compile;

    var overrideOptions = {
        type: 'keyup',
        target: 'overrideTarget'
    }

    var clickOverrideOptions = {
        type: 'click',
        target: 'overrideTarget'
    }

    beforeEach(function () {
        module('sp.utility');
        inject(function ($rootScope, $document, spKeyBinder, $compile) {
            service = spKeyBinder;
            scope = $rootScope;
            rootScope = $rootScope;
            document = $document;
            compile = $compile;
        });
        spyOn(rootScope, '$broadcast').andCallThrough();
    });

    /**
     * Bind the key combination.
     * @param keyCombination The key combination.
     * @param overrideOptions The override options.
     */
    var bind = function(keyCombination, overrideOptions) {
        if (overrideOptions) {
            service.bind(keyCombination, overrideOptions);
        } else {
            service.bind(keyCombination);
        }
    }

    /**
     * Unbind the key combination.
     * @param keyCombination The key combination.
     * @param overrideOptions The override options.
     */
    var unbind = function(keyCombination, overrideOptions) {
        if (overrideOptions) {
            service.unbind(keyCombination, overrideOptions);
        } else {
            service.unbind(keyCombination);
        }
    }

    /**
     * Test the bindings.
     * @param context The context containing all the information needed to execute the tests.
     */
    var testBinding = function (context) {
        it('should set the counters to 1', function () {
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBe(1);
        });
        it('should increment the counters', function () {
            bind(context.keyCombination, context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBe(2);
        });
        it('should broadcast the event on a given event', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith(context.broadcastEventName);
        });
        it('should broadcast the event on a given event with a different dom implementation', function () {
            var e = $.Event(context.type, { which: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith(context.broadcastEventName);
        });
        it('should not broadcast the event on a given event with an unknown dom implementation', function () {
            var e = $.Event(context.type, { unexpectedobject: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a given event with another key', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode + 1, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    }

    /**
     * Test the unbindings.
     * @param context The context containing all the information needed to execute the tests.
     */
    var testUnbinding = function (context) {
        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBe(1);
            unbind(context.keyCombination, context.overrideOptions);
            expect(service.handlers[context.type]).toBeUndefined();
        });
        it('should not break when trying to unbind a non bind event', function () {
            bind(context.keyCombination, context.overrideOptions);
            unbind(context.keyCombination, context.overrideOptions); // unbind the first
            unbind(context.keyCombination, context.overrideOptions); // unbind the second
            unbind(context.keyCombination, context.overrideOptions); // nothing to unbind
        });
        it('should remove the type if there are no more key combinations registered', function () {
            bind('tab', context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations['tab']).toBe(1);
            service.unbind(context.keyCombination, context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBeUndefined();
            expect(service.handlers[context.type].elements[context.target].keyCombinations['tab']).toBe(1);
        });
    }

    describe('should bind and unbind a special key with default options', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'escape',
            broadcastEventName: 'keydown-escape',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 27
        }

        beforeEach(function () {
            service.bind(context.keyCombination);
            context.element = document;
        });

        testBinding(context);
        testUnbinding(context);
    });

    describe('should bind and unbind a special key with override options', function () {
        var context = {
            type: overrideOptions.type,
            target: overrideOptions.target,
            keyCombination: 'escape',
            broadcastEventName: 'keyup-escape',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 27,
            overrideOptions: overrideOptions
        }

        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(context.keyCombination, context.overrideOptions);
            context.element = element;
        });

        testBinding(context);
        testUnbinding(context);
    });

    describe('should bind and unbind a key combination with default options', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'ctrl+shift+x',
            broadcastEventName: 'keydown-ctrl+shift+x',
            ctrlKey: 1,
            shiftKey: 1,
            altKey: 0,
            keyCode: 88
        }

        beforeEach(function () {
            service.bind(context.keyCombination);
            context.element = document;
        });

        testBinding(context);
        testUnbinding(context);
    });

    describe('should bind and unbind a key combination with override options', function () {
        var context = {
            type: overrideOptions.type,
            target: overrideOptions.target,
            keyCombination: 'ctrl+shift+alt+x',
            broadcastEventName: 'keyup-ctrl+shift+alt+x',
            ctrlKey: 1,
            shiftKey: 1,
            altKey: 1,
            keyCode: 88,
            overrideOptions: overrideOptions
        }

        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(context.keyCombination, context.overrideOptions);
            context.element = element;
        });

        testBinding(context);
        testUnbinding(context);
    });

    describe('should bind and unbind an undefined key with default options', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'mousedown',
            broadcastEventName: 'keydown',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 1
        }

        beforeEach(function () {
            service.bind(undefined);
            context.element = document;
        });

        testBinding(context);
        testUnbinding(context);
    });

    describe('should bind and unbind an undefined key with override options', function () {
        var context = {
            type: clickOverrideOptions.type,
            target: clickOverrideOptions.target,
            keyCombination: 'mousedown',
            broadcastEventName: 'click',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 1,
            overrideOptions: clickOverrideOptions
        }

        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(undefined, context.overrideOptions);
            context.element = element;
        });

        testBinding(context);
        testUnbinding(context);
    });
});
