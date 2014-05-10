'use strict';

describe('bindOnce', function () {
    var oneWayX, oneWayY, oneWayZ, twoWayX, twoWayY, inputX, inputY;
    beforeEach(function () {
        browser.get('/test/protractor/sp/binding/spBindOnce.html');
        oneWayX = element(by.id('oneWayX'));
        oneWayY = element(by.id('oneWayY'));
        twoWayX = element(by.id('twoWayX'));
        twoWayY = element(by.id('twoWayY'));
        inputX = element(by.name('updateX'));
        inputY = element(by.name('updateY'));
    });

    it('should bind both one way and two way', function () {
        expect(oneWayX.getText()).toBe('x: x');
        expect(oneWayY.getText()).toBe('y: y');
        expect(twoWayX.getText()).toBe('x: x');
        expect(twoWayY.getText()).toBe('y: y');
    });

    it('should only update two way binds', function () {
        inputX.clear();
        inputX.sendKeys('updatedX');
        inputY.clear();
        inputY.sendKeys('updatedY');

        expect(oneWayX.getText()).toBe('x: x');
        expect(oneWayY.getText()).toBe('y: y');
        expect(twoWayX.getText()).toBe('x: updatedX');
        expect(twoWayY.getText()).toBe('y: updatedY');
    });
});