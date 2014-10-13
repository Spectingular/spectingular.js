'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider')
    .directive('spSlider', ['$window','$timeout', 'spUtils', function($window, $timeout, spUtils) {
        return {
            restrict: 'E',
            replace:true,
            scope:{
                min:'=',
                max:'=',
                value: '='

            },
            link: function(scope, element, attr) {

                var step = (attr.stepsize) ? attr.stepsize : 1,
                    decimals= (attr.decimals) ? attr.decimals : 2;

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

                function nextStep(val) {
                    // round the value to the nearest step

                }


                var sliderProps = calcSliderProps();

//                // bind to winodw resize: @todo: use mqService
                angular.element($window).on('resize', function () {
                    $timeout(function() {
                        sliderProps = calcSliderProps();
                        setSliderPos(valToPixel(scope.value));
                   });
                });

                scope.$on('posChange' ,function(event, y, x){
                    scope.value = spUtils.round(pixelToVal(x),decimals);
                    scope.$apply();
                });

                scope.$watch('value',function(val){
                    setSliderPos(valToPixel(val));
                });
            },
            controller: 'sliderCtrl',
            template:
                '<div class="slider-bar" sp-draggable-container id="slider_{{$id}}">' +
                    '<span class="handle" sp-draggable="x">trek!</span>' +
                '</div>'
        }
    }]);

angular.module('sp.slider')
    .controller('sliderCtrl',function($scope){
        console.log($scope)
});