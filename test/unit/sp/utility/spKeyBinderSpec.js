'use strict';

describe('spKeyBinder service', function () {
    var rootScope, scope, service, document, window, element, compile;

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

    describe('binding the special key with default options', function () {
        beforeEach(function () {
            service.bind('escape');
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['escape']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind('escape');
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['escape']).toBe(2);
        });
        it('should broadcast the event on a keydown event with the special key', function () {
            var e = $.Event("keydown", { keyCode: 27 });
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown-escape');
        });
        it('should broadcast the event on a keydown event with the special key using a different dom implementation', function () {
            var e = $.Event("keydown", { which: 27 });
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown-escape');
        });
        it('should not broadcast the event on a keydown event with the special key using an unknown dom implementation', function () {
            var e = $.Event("keydown", { unexpectedobject: 27 });
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keydown event with another special key', function () {
            var e = $.Event("keydown", { keyCode: 28 });
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding the special key with default options', function () {
        beforeEach(function () {
            service.bind('escape');
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['escape']).toBe(1);
            service.unbind('escape');
            expect(service.handlers.keydown).toBeUndefined();
        });
        it('should not break when trying to unbind a non bind event', function () {
            service.bind('escape');
            service.unbind('escape'); // unbind the first
            service.unbind('escape'); // unbind the second
            service.unbind('escape'); // nothing to unbind
        });
        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('tab');
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['escape']).toBe(1);
            expect(service.handlers.keydown.keyCombinations['tab']).toBe(1);
            service.unbind('escape');
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['escape']).toBeUndefined();
            expect(service.handlers.keydown.keyCombinations['tab']).toBe(1);
        });
    });

    describe('binding the special key with override options', function () {
        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind('escape', overrideOptions);
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['escape']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind('escape', overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['escape']).toBe(2);
        });
        it('should broadcast the event on a keyup event with the special key', function () {
            var e = $.Event("keyup", { keyCode: 27 });
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup-escape');
        });
        it('should broadcast the event on a keyup event with the special key using a different dom implementation', function () {
            var e = $.Event("keyup", { which: 27 });
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup-escape');
        });
        it('should not broadcast the event on a keyup event with the special key using an unknown dom implementation', function () {
            var e = $.Event("keyup", { unexpectedobject: 27 });
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keyup event with another special key', function () {
            var e = $.Event("keyup", { keyCode: 28 });
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding the special key with override options', function () {
        beforeEach(function () {
            service.bind('escape', overrideOptions);
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['escape']).toBe(1);
            service.unbind('escape', overrideOptions);
            expect(service.handlers.keyup).toBeUndefined();
        });

        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('tab', overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['escape']).toBe(1);
            expect(service.handlers.keyup.keyCombinations['tab']).toBe(1);
            service.unbind('escape', overrideOptions);
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['escape']).toBeUndefined();
            expect(service.handlers.keyup.keyCombinations['tab']).toBe(1);
        });
    });

    describe('binding a key combination with default options', function () {
        beforeEach(function () {
            service.bind('ctrl+shift+x');
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+x']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind('ctrl+shift+x');
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+x']).toBe(2);
        });
        it('should broadcast the event on a keydown event with the key combination', function () {
            var e = $.Event("keydown", { keyCode: 88, ctrlKey: 1, shiftKey: 1});
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown-ctrl+shift+x');
        });
        it('should broadcast the event on a keydown event with the key combination using a different dom implementation', function () {
            var e = $.Event("keydown", { which: 88, ctrlKey: 1, shiftKey: 1});
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown-ctrl+shift+x');
        });
        it('should not broadcast the event on a keydown event with the key combination using an unknown dom implementation', function () {
            var e = $.Event("keydown", { unexpectedobject: 88, ctrlKey: 1, shiftKey: 1});
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keydown event with another special key', function () {
            var e = $.Event("keydown", { keyCode: 89, ctrlKey: 1, shiftKey: 1, altKey: 1  });
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding the key combination with default options', function () {
        beforeEach(function () {
            service.bind('ctrl+shift+x');
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+x']).toBe(1);
            service.unbind('ctrl+shift+x');
            expect(service.handlers.keydown).toBeUndefined();
        });

        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('ctrl+shift+y');
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+x']).toBe(1);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+y']).toBe(1);
            service.unbind('ctrl+shift+x');
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+x']).toBeUndefined();
            expect(service.handlers.keydown.keyCombinations['ctrl+shift+y']).toBe(1);
        });
    });

    describe('binding a key combination with override options', function () {
        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind('ctrl+shift+x', overrideOptions);
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+x']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind('ctrl+shift+x', overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+x']).toBe(2);
        });
        it('should broadcast the event on a keydown event with the key combination', function () {
            var e = $.Event("keyup", { keyCode: 88, ctrlKey: 1, shiftKey: 1});
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup-ctrl+shift+x');
        });
        it('should broadcast the event on a keydown event with the key combination using a different dom implementation', function () {
            var e = $.Event("keyup", { which: 88, ctrlKey: 1, shiftKey: 1});
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup-ctrl+shift+x');
        });
        it('should not broadcast the event on a keydown event with the key combination using an unknown dom implementation', function () {
            var e = $.Event("keyup", { unexpectedobject: 88, ctrlKey: 1, shiftKey: 1});
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keydown event with another special key', function () {
            var e = $.Event("keyup", { keyCode: 89, ctrlKey: 1, shiftKey: 1  });
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding the key combination with override options', function () {
        beforeEach(function () {
            service.bind('ctrl+shift+x', overrideOptions);
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+x']).toBe(1);
            service.unbind('ctrl+shift+x', overrideOptions);
            expect(service.handlers.keyup).toBeUndefined();
        });

        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('ctrl+shift+y', overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+x']).toBe(1);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+y']).toBe(1);
            service.unbind('ctrl+shift+x', overrideOptions);
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+x']).toBeUndefined();
            expect(service.handlers.keyup.keyCombinations['ctrl+shift+y']).toBe(1);
        });
    });

    describe('binding an undefined key with default options', function () {
        beforeEach(function () {
            service.bind(undefined);
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['mousedown']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind(undefined);
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['mousedown']).toBe(2);
        });
        it('should broadcast the event on a keydown event with the special key', function () {
            var e = $.Event("keydown", { keyCode: 1 });
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown');
        });
        it('should broadcast the event on a keydown event with the special key using a different dom implementation', function () {
            var e = $.Event("keydown", { which: 1 });
            document.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keydown');
        });
        it('should not broadcast the event on a keydown event with the special key using an unknown dom implementation', function () {
            var e = $.Event("keydown", { unexpectedobject: 1 });
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keydown event with another special key', function () {
            var e = $.Event("keydown", { keyCode: 2 });
            document.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding an undefined key with default options', function () {
        beforeEach(function () {
            service.bind(undefined);
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['mousedown']).toBe(1);
            service.unbind(undefined);
            expect(service.handlers.keydown).toBeUndefined();
        });
        it('should not break when trying to unbind a non bind event', function () {
            service.bind(undefined);
            service.unbind(undefined); // unbind the first
            service.unbind(undefined); // unbind the second
            service.unbind(undefined); // nothing to unbind
        });
        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('tab');
            expect(service.handlers.keydown.count).toBe(2);
            expect(service.handlers.keydown.keyCombinations['mousedown']).toBe(1);
            expect(service.handlers.keydown.keyCombinations['tab']).toBe(1);
            service.unbind(undefined);
            expect(service.handlers.keydown.count).toBe(1);
            expect(service.handlers.keydown.keyCombinations['mousedown']).toBeUndefined();
            expect(service.handlers.keydown.keyCombinations['tab']).toBe(1);
        });
    });

    describe('binding an undefined key with override options', function () {
        beforeEach(function () {
            element = angular.element('<div id="overrideTarget" name="test">some dom element</div>');
            spyOn(angular, 'element').andReturn(element);
            compile(element)(scope);
            service.bind(undefined, overrideOptions);
        });

        it('should set the counters to 1', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['mousedown']).toBe(1);
        });
        it('should increment the counters', function () {
            service.bind(undefined, overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['mousedown']).toBe(2);
        });
        it('should broadcast the event on a keyup event with the special key', function () {
            var e = $.Event("keyup", { keyCode: 1 });
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup');
        });
        it('should broadcast the event on a keyup event with the special key using a different dom implementation', function () {
            var e = $.Event("keyup", { which: 1 });
            element.trigger(e);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('keyup');
        });
        it('should not broadcast the event on a keyup event with the special key using an unknown dom implementation', function () {
            var e = $.Event("keyup", { unexpectedobject: 1 });
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
        it('should not broadcast the event on a keyup event with another special key', function () {
            var e = $.Event("keyup", { keyCode: 2 });
            element.trigger(e);
            expect(rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });

    describe('unbinding an undefined key with override options', function () {
        beforeEach(function () {
            service.bind(undefined, overrideOptions);
        });

        it('should remove the type if there are no more key combinations registered', function () {
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['mousedown']).toBe(1);
            service.unbind(undefined, overrideOptions);
            expect(service.handlers.keyup).toBeUndefined();
        });

        it('should remove the type if there are no more key combinations registered', function () {
            service.bind('tab', overrideOptions);
            expect(service.handlers.keyup.count).toBe(2);
            expect(service.handlers.keyup.keyCombinations['mousedown']).toBe(1);
            expect(service.handlers.keyup.keyCombinations['tab']).toBe(1);
            service.unbind(undefined, overrideOptions);
            expect(service.handlers.keyup.count).toBe(1);
            expect(service.handlers.keyup.keyCombinations['mousedown']).toBeUndefined();
            expect(service.handlers.keyup.keyCombinations['tab']).toBe(1);
        });
    });
});
