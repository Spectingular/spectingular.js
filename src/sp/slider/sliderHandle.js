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
            replace: true,
            scope:true,
            link: function(scope, element, attr,ctrl) {
                var correction = (scope.orientationX) ? element.width(): element.height();

                scope.range = attr.range;
                if (scope.range) {
                    console.log('ranged')
                    ctrl.addHandle(scope.$id);
                }

                function setSliderPos(px, scaleSize) {
                    var cssProp =  (scope.orientationX) ? 'left': 'top';
                    element.css(cssProp, ((px-correction)/scaleSize)*100 + '%');
                }

                attr.$observe('stepsize', function(val){
                    scope.pxStep = val;
                })

                element.on('mouseup', function(){
                   setSliderPos(scope.px);
                });

                element.on('keyup', function(){
                    setSliderPos(scope.px);
                });

                scope.$on('setHandle' ,function(event, px, scaleSize, value){
                    scope.value = value;
                    scope.px = px;
                    scope.scaleSize = scaleSize;
                    setSliderPos(px, scaleSize);
                });

                $timeout(function() {
                    var bindTarget = {target: 'sh_' + scope.$id};
                    var bindEvent = {}

                    if (scope.orientationX) {
                        bindEvent.up = 'right';
                        bindEvent.down =  'left';
                    } else {
                        bindEvent.up= 'down';
                        bindEvent.down= 'up';
                    }
                    spKeyBinder.bind(bindEvent.down, function () {
                        var newPos = (scope.px > 0) ? (scope.px - parseInt(scope.pxStep)) : 0;
                        setSliderPos(newPos, scope.scaleSize);
                        scope.$emit('posChange', newPos, newPos, scope.$id);
                    }, bindTarget);
                    spKeyBinder.bind(bindEvent.up, function () {
                        var newPos = (scope.px < scope.scaleSize)? scope.px + parseInt(scope.pxStep): scope.scaleSize;
                        setSliderPos(newPos, scope.scaleSize);
                        scope.$emit('posChange', newPos, newPos, scope.$id);
                    }, bindTarget);
                });
            },
            template:
                '<div class="handle" tabindex="0" id="sh_{{$id}}" sp-draggable="{{orientation}}">' +
                '   <div>someHandle</div>' +
                '   <div>{{value}}</div>' +
                '</div>'
        }
    }]);
