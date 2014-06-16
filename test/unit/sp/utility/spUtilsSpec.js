'use strict';

describe('utilities', function () {
    var utils;

    beforeEach(function () {
        module('sp.utility');
        inject(function (spUtils) {
            utils = spUtils;
        });
    });

    describe('traversal', function () {
        var obj = {
            foo: "bar",
            baz: {
                "Yaki Tori": "foobaar"
            }
        };

        describe('the traverse function', function () {
            it('should return undefined if the path does not exist', function () {
                expect(utils.traverse(obj, ["bar"])).toBeUndefined();
            });


            it('should return the object if empty path arry', function () {
                expect(utils.traverse(obj, [])).toBe(obj);
            });

            it('should return the value at the destination of the path when the path is array', function () {
                expect(utils.traverse(obj, ["baz"])).toEqual(obj.baz);
                expect(utils.traverse(obj, ["baz", "Yaki Tori"])).toEqual(obj.baz["Yaki Tori"]);
            });
        });

        describe('the traverseOrDefault function', function () {
            it('should return the default value if the path does not exist', function () {
                var defaultVal = "@($gr0jd";
                expect(utils.traverseOrDefault(obj, ["bar"], defaultVal)).toEqual(defaultVal);
            });

            it('should return the value at the destination of the path when the path is array', function () {
                expect(utils.traverseOrDefault(obj, ["baz"])).toEqual(obj.baz);
                expect(utils.traverseOrDefault(obj, ["baz", "Yaki Tori"])).toEqual(obj.baz["Yaki Tori"]);
            });
        })
    })
});