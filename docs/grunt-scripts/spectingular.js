'use strict';

/**
 * @ngdoc directive
 * @name sp.binding.directive:spBindOnce
 *
 * @description
 * Directive for handling one way binding, by destroying the scope within.
 *
 * @example
 <example module="spBindExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>one way binding</h3>
          <span sp-bind-once>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span>
          <h3>two way binding</h3>
          <span>
             value 1: {{model.value1}}<br />
             value 2: {{model.value2}}
          </span><br />
          <h3>change</h3>
          value 1: <input type="text" ng-model="model.value1" /><br />
          value 2: <input type="text" ng-model="model.value2" />
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spBindExample', ['sp.binding']).
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
'use strict';

/**
 * @ngdoc filter
 * @name sp.utility.filter:spTrusted
 *
 * @description
 * Filter for trusting html.
 *
 * @example
 <example module="spTrustedExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>trusted</h3>
          <div ng-bind-html="snippet | spTrusted"></div>
          <h3>untrusted</h3>
          <div ng-bind-html="snippet"></div>
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spTrustedExample', ['sp.utility']).
          controller('ctrl', function($scope) {
             $scope.snippet = '<p style="color:blue">an html\n<em onmouseover="this.textContent=\'PWN3D!\'">hover</em>\nsnippet</p>';
          });
 </file>
 </example>
 **/

angular.module('sp.utility', ['ngSanitize'])
    .filter('spTrusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);