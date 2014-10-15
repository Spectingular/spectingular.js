'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * wrapper for the slider, uses to talk between to isolated children
 **/

angular.module('sp.sliderxxx')
    .directive('spSlider', ['$window','$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            link: function(scope, element, attr) {
                scope.test = 'test';
                scope.$on('posChange' ,function(event, y, x){
                    scope.$broadcast('viewChanged', y, x);
                });


            }

        }
    }]);
