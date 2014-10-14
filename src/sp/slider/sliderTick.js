'use strict';

/**
 * @ngdoc directive
 * @name sp.slider.spSlider
 *
 * @description
 * tenders a 'tick' inside the sidler bar and handles clicks on it
 **/


angular.module('sp.slider').directive('sliderTick' ,function() {
    return {
        require: '^spSlider',
        link: function(scope, element, attrs,ctrl){
            console.log(scope)
            element.css('width', attrs.metricBar);
        }
    }
});
