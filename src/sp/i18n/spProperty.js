'use strict';

/**
 * @ngdoc directive
 * @name sp.i18n.directive:spProperty
 *
 * @description
 * Directive for displaying properties from the {@link sp.i18n.spProperties} service.
 * Note: this directive also support binding with the curly braches notation ( {{  }} )
 *
 * @param {String} key The property key to display
 * @param {String=} identifier The properties identifier
 * @param {String=} locale The locale
 *
 * @example
 <example module="spPropertyExample">
    <file name="index.html">
       <div ng-controller="ctrl">
          <h3>Using attributes identifier [`example`], key [`welcome-message`] and locale [`nl-nl`]</h3>
          <div sp-property identifier='example' key='welcome-message' locale='nl-nl'></div>
          <h3>Using attributes identifier [`example`], key [`welcome-message`] and the default locale</h3>
          <div sp-property identifier='example' key='welcome-message'></div>
          <h3>Using attribute key [`welcome-message`] and the default locale and identifier</h3>
          <div sp-property key='welcome-message'></div>
       </div>
    </file>

    <file name="scripts.js">
       angular.module('spPropertyExample', ['sp.i18n']).
          config(function(spPropertiesProvider, spPropertyConfigProvider) {
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                'welcome-message': 'hello I am {{who}}'
             }, 'en-us');
             spPropertiesProvider.add('example', {
                'name': 'spectingular',
                'welcome-message': 'hallo ik ben {{who}}'
             }, 'nl-nl');
             spPropertyConfigProvider.setDefaultIdentifier('example');
          }).
          controller('ctrl', function($scope) {
             $scope.who = 'Spectingular';
          });
    </file>
 </example>
 **/
angular.module('sp.i18n').directive('spProperty', ['spProperties', 'spPropertyConfig', '$compile', function (spProperties, spPropertyConfig, $compile) {
    return {
        restrict: 'EA',
        scope: false,
        link: function (scope, element, attrs) {
            var identifier = angular.isDefined(attrs.identifier) ? attrs.identifier : spPropertyConfig.defaultIdentifier;
            var locale = angular.isDefined(attrs.locale) ? attrs.locale : spPropertyConfig.defaultLocale;

            element.html(spProperties.property(identifier, attrs.key, locale));
            $compile(element.contents())(scope);
        }
    };
}]);