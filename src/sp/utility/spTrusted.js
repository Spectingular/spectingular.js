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