'use strict';

/**
 * @ngdoc directive
 * @name sp.binding.spBindOnce
 *
 * @description
 * Directive for handling one way binding, by destroying the scope within.
 *
 * @example
 <example module="example">
    <file name="index.html">
        <div ng-controller="ctrl">
            one way binding: <span sp-bind-once>{{model.value1}}{{model.value2}}</span><br/>
            two way binding: <span>{{model.value1}}{{model.value2}}</span><br />
            value 1: <input type="text" ng-model="model.value1" /><br />
            value 2: <input type="text" ng-model="model.value2" />
        </div>
    </file>

    <file name="scripts.js">
        angular.module('example', ['sp.binding']).
            controller('ctrl', function($scope) {
                 $scope.model = {
                    value1 : 'original value 1',
                    value2 : 'original value 2'
                    };
             });
    </file>
 </example>
 **/

angular.module('sp.binding', []).directive('spBindOnce', ['$timeout', function ($timeout) {
    return {
        scope: true,
        link: function (scope) {
            $timeout(function () {
                scope.$destroy();
            }, 0);
        }
    };
}]);