'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider')
    .directive('spSlider', ['$window','$timeout', '$document','spUtils', function($window, $timeout, $document, spUtils) {
        return {
            restrict: 'E',
            replace:true,

            scope:{
                min:'=',
                max:'=',
                value: '=',
                step: '=stepsize'

            },
            link: function(scope, element, attr) {

                var decimals= (attr.decimals) ? attr.decimals : 2;

                function calcSliderProps() {
                    var scaleSize= element.width(),
                        scaleRange= scope.max - scope.min,
                        valPxRatio= scaleRange / scaleSize,
                        handle= element.find('.handle');

                    return {
                        scaleSize:scaleSize,
                        scaleRange:scaleRange,
                        valPxRatio: valPxRatio,
                        handle: handle,
                        handleSizeCorr: valPxRatio * (handle.width() / 2)
                    }
                }

                function pixelToVal(x) {
                    return x * sliderProps.valPxRatio + sliderProps.handleSizeCorr + scope.min;
                }

                function setSliderPos(x) {
                    sliderProps.handle.css({left:x+'px'});
                }

                function valToPixel(val) {
                    return (val- (sliderProps.handleSizeCorr+scope.min)) / sliderProps.valPxRatio;
                }

                function roundtoStep(val, step) {
                    return step+ Math.round((val - step)/ step ) * step;
                }

                $document.on('mouseup', function(){
                    setSliderPos(valToPixel(roundtoStep(scope.value, scope.step)));
                });

                var sliderProps = calcSliderProps();

                scope.stepWidth = scope.step / sliderProps.valPxRatio;

                // bind to winodw resize: @todo: use mqService
                angular.element($window).on('resize', function () {
                    $timeout(function() {
                        sliderProps = calcSliderProps();
                        setSliderPos(valToPixel(roundtoStep(scope.value, scope.step)));
                   });
                });

                scope.$on('posChange' ,function(event, y, x){
                    scope.value = roundtoStep(spUtils.round(pixelToVal(x),decimals),scope.step);
                    scope.$apply();
                });

                scope.$watch('value',function(val){
                    setSliderPos(valToPixel(roundtoStep(val, scope.step)));
                });
            },
            controller: 'sliderCtrl',
            template:
                '<div class="slider-bar" sp-draggable-container id="slider_{{$id}}" >' +
                    '<span ng-class="{\'lower\': (interval * step + min)< value}" metric-bar="{{stepWidth}}" class="barmetric" ng-repeat="interval in intervals">{{(interval * step) + min}}</span>' +
                    '<span class="handle" sp-draggable="x">trek!</span>' +
                '</div>'
        }
    }]);

angular.module('sp.slider')
    .controller('sliderCtrl',function($scope){
        $scope.intervals = [];
        for(var i=0; i< ($scope.max - $scope.min)/$scope.step; i++) {
            $scope.intervals.push(i);
        }
});

angular.module('sp.slider').directive('metricBar' ,function() {
    return {
        scope: true,

        link: function(scope, element, attrs){
            console.log(scope)
            element.css('width', attrs.metricBar);

        }

    }
});
