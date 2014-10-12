'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider', [])
    .directive('spSlider', ['$window','$timeout', function($window, $timeout) {
        return {
            restrict: 'E',
            replace:true,
            scope:{
                min:'=',
                max:'=',
                value: '='
            },
            link: function(scope, element, attr) {

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

                var sliderProps = calcSliderProps();

//                // bind to winodw resize: @todo: use mqService
                angular.element($window).on('resize', function () {
console.log('resize slider')
                //    $timeout(function() {
//                        var posBefore = valToPixel(scope.value);
                        sliderProps = calcSliderProps();
//                        var posAfter = valToPixel(scope.value);
//                        if(posBefore !== posAfter) {
//                            console.log('after: ' + valToPixel(scope.value))
                            setSliderPos(valToPixel(scope.value));
//                        }
                 //  });
                });

                scope.$on('posChange' ,function(event, y, x){
                    scope.value = pixelToVal(x);
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