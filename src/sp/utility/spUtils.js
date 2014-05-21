'use strict';

/**
 * @ngdoc service
 * @name sp.utility.spUtils
 *
 * @description
 * Service that provides utility functions such as safe object traversal.
 **/
angular.module('sp.utility', []).service('spUtils', function () {
    var fn = {};

    /**
     * @ngdoc method
     * @name sp.utility.spUtils#traverse
     * @methodOf sp.utility.spUtils
     * @param {Object} object The object to traverse
     * @param {Array} path Array of string
     * @example
     <example module="spUtilsExample">
     <file name="index.html">
     <div ng-controller="ctrl">
     <h3>Existing Path</h3>
     {{result}}
     <h3>Non-existing path</h3>
     {{resultWithoutDefault}}
     <h3>Non-existing path with default</h3>
     {{resultWithDefault}}
     </div>
     </file>

     <file name="scripts.js">
     angular.module("spUtilsExample", ['sp.utility']).
     controller('ctrl', function($scope, spUtils) {
             var obj = {
                'foo': {
                    'bar': "restaurant"
                }
             };
             $scope.result                = spUtils.traverse(obj, ['foo', 'bar']);
             $scope.resultWithoutDefault  = spUtils.traverse(obj, ['foo', 'baz']);
             $scope.resultWithDefault     = spUtils.traverseOrDefault(obj, ['foo', 'baz'], "someDefaultValue");
          });
     </file>
     </example>
     */
    function traverse(object, path) {
        if (path.length === 0) {
            return object;
        } else {
            var head  = path.shift(),
                child = object[head];
            return angular.isDefined(child) ? traverse(child, path) : undefined;
        }
    }

    fn.traverse = traverse;

    fn.traverseOrDefault = function (object, path, defaultValue) {
        var result = fn.traverse(object, path);
        return angular.isDefined(result) ? result : defaultValue;
    };

    return fn;
});