const expect = require('chai').expect;
const dynamicConfig = require('../index.js');
const { DynamicConfig } = require('../index.js');

describe('Key testing', function () {
    beforeEach(function () {
        dynamicConfig.setConfiguration({});
        dynamicConfig.set('1', 1);
        dynamicConfig.set('2', 'test');
        dynamicConfig.set(3, 3);
        dynamicConfig.set(4, 'test4');
    })

    it('Get key', function () {
        expect(dynamicConfig.get('1')).to.equal(1);
        expect(dynamicConfig.get('2')).to.equal('test');
        expect(dynamicConfig.get(3)).to.equal(3);
        expect(dynamicConfig.get(4)).to.equal('test4');
    })

    it('Set key', function () {
        dynamicConfig.set('5', 5);
        expect(dynamicConfig.get('5')).to.equal(5);
        dynamicConfig.set(6, 6);
        expect(dynamicConfig.get(6)).to.equal(6);
    })

    it('Get key with default value', function () {
        expect(dynamicConfig.get(5, 1)).to.equal(1);
        expect(dynamicConfig.get('6', 'test')).to.equal('test');
    })

});