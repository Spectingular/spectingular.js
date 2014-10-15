'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider')
    .directive('spSlider', ['$window','$timeout','spKeyBinder', function($window, $timeout,spKeyBinder) {
        return {
            restrict: 'E',
            require: 'ngModel',
            replace:true,
            transclude: true,
            scope:{
                min:'=',
                max:'=',
                step: '=stepsize',
                orientation: '='
            },
            link: function(scope, element, attr, ngModel) {

                function init() {
                    scope.sliderProps = {
                        scaleSize: (scope.orientationX) ? element.width() : element.height() ,
                        scaleRange: scope.max - scope.min
                    }
                    scope.sliderProps.valPxRatio= scope.sliderProps.scaleRange / scope.sliderProps.scaleSize;
                }
                scope.orientationX = (scope.orientation ==='y') ? false : true;

                ngModel.$viewChangeListeners.push(onModelUpdate);
                ngModel.$render = function() {
                    scope.$broadcast('setHandle', (valToPixel(roundtoStep(ngModel.$modelValue, scope.step))), scope.sliderProps.scaleSize, ngModel.$modelValue);
                }

                scope.$on('posChange' ,function(event, y, x){
                    var px =  (scope.orientationX) ? x : y;
                    ngModel.$setViewValue(roundtoStep(pixelToVal(px),scope.step));
                    scope.$apply();
                });

                angular.element($window).on('resize', function () {
                    $timeout(function() {
                        init();
                   });
                });
                init();

                function onModelUpdate() {
                    scope.$broadcast('setHandle', (valToPixel(roundtoStep(ngModel.$modelValue, scope.step))), scope.sliderProps.scaleSize, ngModel.$modelValue);
                }

                function pixelToVal(x) {
                    return x * scope.sliderProps.valPxRatio + scope.min;
                }

                function valToPixel(val) {
                    return (val- scope.min) / scope.sliderProps.valPxRatio;
                }

                function roundtoStep(val, step) {
                    return step+ Math.round((val - step)/ step ) * step;
                }
                $timeout(function() {
                    init();
                    scope.stepsize = valToPixel(scope.min +scope.step);

//                    if(angular.isObject(ngModel.$modelValue)) {
//                        console.log('we ahve a range')
//                        scope.range = true;
//
//                    }
                    scope.$broadcast('setHandle', (valToPixel(roundtoStep(ngModel.$modelValue, scope.step))), scope.sliderProps.scaleSize,  ngModel.$modelValue);
                });
            },
            controller: 'sliderCtrl',
            template:
                '<div class="slider-bar-{{orientation}}" sp-draggable-container id="slider_{{$id}}" >' +
                '   <sp-slider-handle stepsize="{{stepsize}}" range="{{range}}"></sp-slider-handle >' +
                '   <sp-slider-handle stepsize="{{stepsize}}" ng-if="range" range="{{range}}" range-high></sp-slider-handle>' +
                '</div>'
        }
    }]);

angular.module('sp.slider')
    .controller('sliderCtrl',function($scope){
        $scope.handles = [];
        this.addHandle = function(handleId){
            $scope.handles.push(handleId);
        }
});