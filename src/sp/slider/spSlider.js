'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider')
    .directive('spSlider', ['$window','$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            replace:true,
            scope:{
                min:'=',
                max:'=',
                value: '=',
                step: '=stepsize',
                orientation: '='
            },
            link: function(scope, element, attr) {

                var decimals= (attr.decimals) ? attr.decimals : 2;
                function init() {
                    scope.sliderProps = {
                        scaleSize: element.width(),
                        scaleRange: scope.max - scope.min,
                        step: scope.step,
                        min: scope.min,
                        max: scope.max,
                        orientation: scope.orientation
                    }
                    scope.sliderProps.valPxRatio= scope.sliderProps.scaleRange / scope.sliderProps.scaleSize;
                    scope.$broadcast('containerChanged', scope.sliderProps);
                }

                angular.element($window).on('resize', function () {
                    $timeout(function() {
                        scope.sliderProps = init();
                   });
                });
                init();
            },
            controller: 'sliderCtrl',
            template:
                '<div class="slider-bar" sp-draggable-container id="slider_{{$id}}" >' +
                    '<sp-slider-handle value="value">HAND</sp-slider-handle>' +
                '</div>'
        }
    }]);

angular.module('sp.slider')
    .controller('sliderCtrl',function($scope){

//        $scope.intervals = [];
//        for(var i=0; i< ($scope.max - $scope.min)/$scope.step; i++) {
//            $scope.intervals.push(i);
//        }
});