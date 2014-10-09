'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * renders the slider bar. Uses other directives inside
 **/

angular.module('sp.slider', [])
    .directive('spSlider', [function() {
        return {
            restrict: 'E',
            replace:true,
            require: 'ngModel',
            scope:{
                min:'@',
                max:'@',
                ngModel: '='
            },
            link: function(scope, element, attr) {
                //get width of element
                var width = element.width();
                
            },
            controller: 'sliderCtrl',
            template:
                '<div>'+
                    '<span>{{min}}</span>' +
                    '<div class="slider-bar" sp-draggable-container id="slider_{{$id}}">' +
                        '<div class="handle" sp-draggable="x">hallo</div>' +
                    '</div>' +
                    '<span>{{max}}</span>'+
                '</div>'

    }

    }]);

angular.module('sp.slider')
    .controller('sliderCtrl',function($scope){
        console.log($scope)
});