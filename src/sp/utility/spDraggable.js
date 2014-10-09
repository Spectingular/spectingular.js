'use strict';

/**
 * @ngdoc service
 * @name sp.utility.spDraggable
 *
 * @description
 * a attribute directive to create a draggable element. Directive will emit the new position
 * Per Default elements will be freely draggable.
 * By adding x or y as a value of the attribute dragging will be limited to the chosen axis
 **/

angular.module('sp.utility', [])
    .directive('spDraggable', ['$document', function($document) {
        return function(scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0, axis = attr.spDraggable;
            if(!element.css('position') || element.css('position')==='static') {
                element.css('position','relative')
            }

            element.on('mousedown', function(event) {
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                if (axis==='y'){
                   y = event.pageY - startY;
                } else if (axis==='x'){
                   x = event.pageX - startX;
                } else {
                   y = event.pageY - startY;
                   x = event.pageX - startX;
                }

                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
                scope.$emit('posChange', {
                    top:y, left:x
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }]);