'use strict';

/**
 * @ngdoc directive
 * @name sp.utility.spDraggable
 *
 * @description
 * a attribute directive to create a draggable element. Directive will emit the new position
 * By adding x or y as a value of the attribute dragging will be limited to the chosen axis
 * Wrapping it with a draggable-container attribute will contain the dragging to the limits of this container
 **/

angular.module('sp.utility', [])
    .directive('spDraggable', ['$document', function($document) {
        return {
            restrict: 'A',
            require: '^?spDraggableContainer',
            link: function (scope, element, attr, ctrl) {
                var dragBound = {};
                if(ctrl) {
                    dragBound = ctrl.returnSize();
                    dragBound.maxX = (dragBound.width - element.width());
                    dragBound.maxY = (dragBound.height - element.height());
                    dragBound.minX = dragBound.minY = 0;
                } else {
                    // no dragBound, set em to document size
                    var elPos = element.offset();
                    dragBound.maxX = ($document.width() - elPos.left - element.width());
                    dragBound.maxY = $document.height() - elPos.top - element.height();
                    dragBound.minY = elPos.top * -1;
                    dragBound.minX = (elPos.left * -1);
                }

                var startX = 0, startY = 0, x = 0, y = 0,
                    axis = attr.spDraggable;

                if (!element.css('position') || element.css('position') === 'static') {
                    element.css('position', 'relative')
                }

                element.on('mousedown', function (event) {
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mouseMove);
                    $document.on('mouseup', mouseUp);
                });

                function mouseMove(event) {
                    if (axis === 'y') {
                        y = event.pageY - startY;
                        y = (y > dragBound.maxY) ? dragBound.maxY : (y < dragBound.minY) ? dragBound.minY : y;
                    } else if (axis === 'x') {
                        x = event.pageX - startX;
                        x = (x > dragBound.maxX) ? dragBound.maxX : (x < dragBound.minX) ? dragBound.minX : x;
                    } else {
                        y = event.pageY - startY;
                        y = (y > dragBound.maxY) ? dragBound.maxY : (y < dragBound.minY) ? dragBound.minY : y;
                        x = event.pageX - startX;
                        x = (x > dragBound.maxX) ? dragBound.maxX : (x < dragBound.minX) ? dragBound.minX : x;
                    }

                    scope.$emit('posChange', {
                        top: y, left: x
                    });
                    element.css({
                        top: y + 'px', left: x + 'px'
                    });
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
            this.returnSize = function() {
                return {
                    width: $element.width(),
                    height: $element.height()
                }
            }
        }
    }
}]);