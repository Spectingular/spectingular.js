'use strict';

describe('spTrusted filter', function () {
    var snippet = '<p style="color:blue">an html\n<em onmouseover="this.textContent=\'PWN3D!\'">hover</em>\nsnippet</p>';
    var element, scope;

    beforeEach(function() {
        module('sp.utility');
        inject(function($rootScope, $compile) {
            scope = $rootScope;
            element = angular.element(
                '<div ng-bind-html="snippet | spTrusted"></div>'
            );
            scope.snippet = snippet;
            $compile(element)(scope);
            scope.$digest();
        })
    });

    it('should trust html', function () {
        expect(element.html()).toEqual(snippet);
    });
});