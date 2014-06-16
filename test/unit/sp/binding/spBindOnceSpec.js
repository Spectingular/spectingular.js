'use strict';

describe('bindOnce', function () {
    var element, scope, timeout;

    beforeEach(function() {
        module('sp.binding');
        inject(function($rootScope, $compile, $timeout) {
            scope = $rootScope;
            timeout = $timeout;
            element = angular.element(
                '<span sp-bind-once>{{model.value1}} - {{model.value2}}</span>'
            );
            scope.model = {
                value1: 'original value 1',
                value2: 'original value 2'
            };
            $compile(element)(scope);
            scope.$digest();
        })
    });

    it('should bind', function () {
        expect(element.text()).toEqual('original value 1 - original value 2');
    });
    it('should destroy scope of element using bind-once', function () {
        var bindOnceScope = element.scope();
        spyOn(bindOnceScope, '$destroy');
        timeout.flush();
        expect(bindOnceScope.$destroy).toHaveBeenCalled();
    });
});