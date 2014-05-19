'use strict';

angular.module('sp.utility', []).service('spUtils', function () {
    var fn = {};

    /**
     * @param object The object to traverse
     * @param path Array of string
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