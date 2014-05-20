'use strict';

var mocks = require('../../../mocks/sp/utility/spTrustedMock').mocks;

describe('spTrusted filter', function () {
    beforeEach(function () {
        browser.get('/test/protractor/sp/utility/spTrusted.html');
    });

    it('should trust unsafe html', function () {
        expect(element(by.id('trusted')).element(by.tagName('em')).getAttribute('onmouseover')).toEqual(mocks.unsafe);
    });

    it('should not trust unsafe html', function () {
        expect(element(by.id('untrusted')).element(by.tagName('em')).getAttribute('onmouseover')).toEqual(mocks.safe);
    });
});