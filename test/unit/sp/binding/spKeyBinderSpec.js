'use strict';

describe('The spKeyBinder service', function () {
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
        module('sp.binding');
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
     * Test the bindings.
     * @param context The context containing all the information needed to execute the tests.
     */
    function bindingTests(context) {
        it('should bind and increment the counters', function () {
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination].count).toBe(1);

            // add the same key combination again
            service.bind(context.keyCombination, context.callback, context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination].count).toBe(2);
        });
    }

    /**
     * Tests that verify the broadcasting when the given event is triggered.
     * @param context The context containing all the information needed to execute the tests.
     */
    function eventTriggerTests(context) {
        it('should broadcast the corresponding event when the keys that are entered match the key combination', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith(context.broadcastEventName);
        });
        it('should broadcast the corresponding event when the keys that are entered match the key combination with a different dom implementation', function () {
            var e = $.Event(context.type, { which: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith(context.broadcastEventName);
        });
        it('should not broadcast the corresponding event when the keys that are entered match the key combination with an unknown dom implementation', function () {
            var e = $.Event(context.type, { unexpectedobject: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the corresponding event when the keys that are entered do not match the key combination', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode + 1, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    }

    /**
     * Tests that verify the callback execution when the given event is triggered.
     * @param context The context containing all the information needed to execute the tests.
     */
    function callbackTriggerTests(context) {
        it('should execute the provided callback when the keys that are entered match the key combination', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(context.callback).toHaveBeenCalled();
        });
        it('should execute the provided callback when the keys that are entered match the key combination with a different dom implementation', function () {
            var e = $.Event(context.type, { which: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(context.callback).toHaveBeenCalled();
        });
        it('should not execute the provided callback when the keys that are entered match the key combination with an unknown dom implementation', function () {
            var e = $.Event(context.type, { unexpectedobject: context.keyCode, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(context.callback).not.toHaveBeenCalled();
        });
        it('should not execute the provided callback when the keys that are entered do not match the key combination', function () {
            var e = $.Event(context.type, { keyCode: context.keyCode + 1, ctrlKey: context.ctrlKey, shiftKey: context.shiftKey, altKey: context.altKey});
            context.element.trigger(e);
            expect(context.callback).not.toHaveBeenCalled();
        });
    }

    /**
     * Test the unbindings.
     * @param context The context containing all the information needed to execute the tests.
     */
    var testUnbinding = function (context) {
        it('should unbind the key combination when there are no other matching key combinations registered', function () {
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination].count).toBe(1);
            service.unbind(context.keyCombination, context.overrideOptions);
            expect(service.handlers[context.type]).toBeUndefined();
        });
        it('should not break when trying to unbind a non bound key combination', function () {
            service.bind(context.keyCombination, context.overrideOptions);
            service.unbind(context.keyCombination, context.overrideOptions); // unbind the first
            service.unbind(context.keyCombination, context.overrideOptions); // unbind the second
            service.unbind(context.keyCombination, context.overrideOptions); // nothing to unbind
        });
        it('should unbind type when there are no more key combinations registered', function () {
            service.bind('tab', context.callback, context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].count).toBe(2);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations['tab'].count).toBe(1);
            service.unbind(context.keyCombination, context.overrideOptions);
            expect(service.handlers[context.type].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].count).toBe(1);
            expect(service.handlers[context.type].elements[context.target].keyCombinations[context.keyCombination]).toBeUndefined();
            expect(service.handlers[context.type].elements[context.target].keyCombinations['tab'].count).toBe(1);
        });
    }

    describe('that uses a special key for binding with default options', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'shift+tab+ctrl+alt',
            broadcastEventName: 'keydown-shift+tab+ctrl+alt',
            ctrlKey: 1,
            shiftKey: 1,
            altKey: 1,
            keyCode: 9
        }

        beforeEach(function () {
            service.bind(context.keyCombination);
            context.element = document;
        });

        bindingTests(context);
        eventTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a special key for binding with default options and callback', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'escape',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 27
        }

        beforeEach(function () {
            context.callback = jasmine.createSpy();
            service.bind(context.keyCombination, context.callback);
            context.element = document;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a special key for binding with override options', function () {
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
            service.bind(context.keyCombination, undefined, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        eventTriggerTests(context)
        testUnbinding(context);
    });

    describe('that uses a special key for binding with override options and callback', function () {
        var context = {
            type: overrideOptions.type,
            target: overrideOptions.target,
            keyCombination: 'escape',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 27,
            overrideOptions: overrideOptions
        }
        beforeEach(function () {
            context.callback = jasmine.createSpy();
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(context.keyCombination, context.callback, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a key combination for binding with default options', function () {
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

        bindingTests(context);
        eventTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a key combination for binding with default options and callback', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'ctrl+shift+x',
            ctrlKey: 1,
            shiftKey: 1,
            altKey: 0,
            keyCode: 88
        }

        beforeEach(function () {
            context.callback = jasmine.createSpy();
            service.bind(context.keyCombination, context.callback);
            context.element = document;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a key combination for binding with override options', function () {
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
            service.bind(context.keyCombination, undefined, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        eventTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses a key combination for binding with override options and callback', function () {
        var context = {
            type: overrideOptions.type,
            target: overrideOptions.target,
            keyCombination: 'ctrl+shift+alt+x',
            ctrlKey: 1,
            shiftKey: 1,
            altKey: 1,
            keyCode: 88,
            overrideOptions: overrideOptions
        }

        beforeEach(function () {
            context.callback = jasmine.createSpy();
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(context.keyCombination, context.callback, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses an undefined key for binding with default options', function () {
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

        bindingTests(context);
        eventTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses an undefined key for binding with default options and callback', function () {
        var context = {
            type: 'keydown',
            target: 'document',
            keyCombination: 'mousedown',
            ctrlKey: 0,
            shiftKey: 0,
            altKey: 0,
            keyCode: 1
        }

        beforeEach(function () {
            context.callback = jasmine.createSpy();
            service.bind(undefined, context.callback);
            context.element = document;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    })

    describe('that uses an undefined key for binding with with override options', function () {
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
            service.bind(undefined, undefined, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        eventTriggerTests(context);
        testUnbinding(context);
    });

    describe('that uses an undefined key for binding with with override options and callback', function () {
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
            context.callback = jasmine.createSpy();
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(undefined, context.callback, context.overrideOptions);
            context.element = element;
        });

        bindingTests(context);
        callbackTriggerTests(context);
        testUnbinding(context);
    });
});
