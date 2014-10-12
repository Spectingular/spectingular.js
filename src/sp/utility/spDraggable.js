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

angular.module('sp.utility', [])
    .directive('spDraggable', ['$window','$document', '$timeout', function($window,$document, $timeout) {
        return {
            restrict: 'A',
            require: '^?spDraggableContainer',
            link: function (scope, element, attr, ctrl) {
                var dragBound = {}, elOffset, elPos, elHeight,elWidth,
                    startX, startY, x, y, axis = attr.spDraggable;

                if (!element.css('position') || element.css('position') === 'static') {
                    element.css('position', 'relative')
                }

                $timeout(function(){
                    setElementProps();
                    setBounds();
                    startX = x = elPos.left;
                    startY = y = elPos.top;
                });

                angular.element($window).on('resize', function (event) {
                    console.log('resizei deagge')
    //                $timeout(function() {
               //         setElementProps();
                        setBounds();
//                        startX = x = elPos.left;
  //                      startY = y = elPos.top;
      //              });

                });

                element.on('mousedown', function (event) {
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mouseMove);
                    $document.on('mouseup', mouseUp);
                });

                function setElementProps () {
                    elOffset = element.offset(),
                    elPos = element.position(),
                    elHeight = element.height(),
                    elWidth = element.width();
                }

                function setBounds(){
                    if(ctrl) {
                        elOffset.left = elOffset.top = 0;
                        dragBound = ctrl.returnSize();
                    } else {
                        elPos.left = elPos.top = 0;
                        dragBound.width = $document.width();
                        dragBound.height = $document.height()
                    }
                    dragBound.maxX = dragBound.width - elOffset.left - (elWidth/2);
                    dragBound.maxY = dragBound.height - elOffset.top - (elHeight/2);
                    dragBound.minX = -(elOffset.left + (elWidth/2));
                    dragBound.minY = -(elOffset.top + (elHeight/2));
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
                    scope.$emit('posChange', y, x);
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