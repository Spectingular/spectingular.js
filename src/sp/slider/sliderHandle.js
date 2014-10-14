'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSliderHandle
 *
 * @description
 * renders the slider Handle. Use as an element
 **/

angular.module('sp.slider')
    .directive('spSliderHandle', ['$timeout','spUtils', 'spKeyBinder', function($timeout, spUtils, spKeyBinder) {
        return {
            restrict: 'E',
            require: '^spSlider',
            scope:{
                value: '='
            },
            replace: true,
            transclude: true,
            link: function(scope, element, attr,ctrl) {
                scope.sliderProps = {};

                scope.$on('containerChanged',function(event, sliderProps){
                    scope.sliderProps = sliderProps;
                    console.log(sliderProps.orientation)
                    scope.sliderProps.valPxRatio = scope.sliderProps.scaleRange / scope.sliderProps.scaleSize;
                    scope.handleSizeCorr= scope.sliderProps.valPxRatio * (element.width() / 2);
                    setSliderPos(valToPixel(roundtoStep(scope.value, scope.sliderProps.step)));
                });

                function setSliderPos(x) {
                    element.css({left: (x / scope.sliderProps.scaleSize) * 100 + '%'});
                }

                function pixelToVal(x) {
                    return x * scope.sliderProps.valPxRatio + scope.handleSizeCorr + scope.sliderProps.min;
                }

                function valToPixel(val) {
                    return (val- (scope.handleSizeCorr+scope.sliderProps.min)) / scope.sliderProps.valPxRatio;
                }

                function roundtoStep(val, step) {
                    return step+ Math.round((val - step)/ step ) * step;
                }

                var bindTarget = {target: element}

                spKeyBinder.bind('left', function() {
                    scope.value = (scope.value > scope.sliderProps.min) ? scope.value - scope.sliderProps.step : scope.sliderProps.min;
                    scope.$apply();
                }, bindTarget);

                spKeyBinder.bind('right', function() {
                    scope.value = (scope.value < scope.sliderProps.max) ? scope.value + scope.sliderProps.step : scope.sliderProps.max;
                    scope.$apply();
                }, bindTarget);

                spKeyBinder.bind('home', function() {
                    scope.value = scope.sliderProps.min;
                }, bindTarget);

                spKeyBinder.bind('end', function() {
                    scope.value = scope.sliderProps.max;
                }, bindTarget);

                element.on('mouseup', function(){
                    setSliderPos(valToPixel(roundtoStep(scope.value, scope.sliderProps.step)));
                });

                scope.$watch('value',function(val){
                    setSliderPos(valToPixel(roundtoStep(val, scope.sliderProps.step)));
                });

                scope.$on('posChange' ,function(event, y, x){
                    scope.value = roundtoStep(pixelToVal(x),scope.sliderProps.step);
                    scope.$apply();
                });
            },
            template: '<div class="handle" tabindex="0" sp-draggable="{{sliderProps.orientation}}" ng-transclude></div>'
        }
    }]);
