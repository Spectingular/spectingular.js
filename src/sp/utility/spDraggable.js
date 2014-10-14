'use strict';

/**
 * @ngdoc directive
 * @name sp.utility.spDraggable
 *
 * @description
 * a attribute directive to create a draggable element. Directive will emit the new position
 * By adding x or y as a value of the attribute dragging will be limited to the chosen axis
 * Wrapping it with a draggable-container attribute will contain the dragging to the limits of this container
 * Default it will be contained by the document.
 * Elements can be dragged half their size out of the container
 **/

angular.module('sp.utility')
    .directive('spDraggable', ['$window','$document', '$timeout', function($window,$document, $timeout) {
        return {
            restrict: 'A',
            require: '^?spDraggableContainer',
            link: function (scope, element, attr, ctrl) {
                var dragBound = {}, elOffset={}, elPos={}, elHeight,elWidth,
                    startX, startY, x=0, y=0, axis = attr.spDraggable;

                element.css('position', 'absolute');

                $timeout(function() {
                    init();
                });

                angular.element($window).on('resize', function () {
                   init();
                });

                element.on('mousedown', function (event) {
                    event.preventDefault();
                    initPosition();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mouseMove);
                    $document.on('mouseup', mouseUp);
                });

                function init() {
                    initPosition();
                    elHeight = element.height(),
                    elWidth = element.width();
                    if(ctrl) {
                        dragBound = ctrl.returnSize();
                    } else {
                        dragBound.width = $document.width();
                        dragBound.height = $document.height()
                    }
                    dragBound.maxX = dragBound.width - (elWidth/2);
                    dragBound.maxY = dragBound.height - (elHeight/2);
                    dragBound.minX = -(elWidth/2);
                    dragBound.minY = -(elHeight/2);
                }

                function initPosition() {
                    elOffset = element.position();
                    x = elOffset.left;
                    y = elOffset.top;
                }

                function mouseMove(event) {
                    if (axis === 'y' || axis==='') {
                        y = event.pageY - startY;
                        y = (y > dragBound.maxY) ? dragBound.maxY : (y < dragBound.minY) ? dragBound.minY : y;
                    }
                    if (axis === 'x' || axis==='') {
                        x = event.pageX - startX;
                        x = (x > dragBound.maxX) ? dragBound.maxX : (x < dragBound.minX) ? dragBound.minX : x;
                    }

                    var yPerc = pixelToPercentage(y, dragBound.height);
                    var xPerc = pixelToPercentage(x, dragBound.width);

                    scope.$emit('posChange', yPerc, xPerc);
                    element.css({
                        top: yPerc + '%', left: xPerc + '%'
                    });
                }

                function pixelToPercentage(px, parentPx) {
                    return (px / parentPx) * 100;
                }

                function mouseUp() {
                    $document.off('mousemove', mouseMove);
                    $document.off('mouseup', mouseUp);
                }
            }
        };
    }]);

angular.module('sp.utility').directive('spDraggableContainer', [ function(){
    return {
        controller: function( $element) {
            if ($element.css('position') === 'static') {
                $element.css('position', 'relative')
            }
            this.returnSize = function() {
                return {
                    width: $element.width(),
                    height: $element.height()
                }
            }
        }
    }
}]);