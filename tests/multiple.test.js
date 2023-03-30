const expect = require('chai').expect;
const dynamicConfig = require('../index.js');
const { DynamicConfig } = require('../index.js');

describe('Multiple testing', function () {
    const config = new DynamicConfig();
    this.beforeEach(function () {
        config.setConfiguration({});
        config.set('TEST', 1);
        config.set('TEST2', 'test');
    });

    it('Get multiple', function () {
        expect(config.get(['TEST3', 'TEST2', 'TEST'], 'not found')).to.equal('test');
        expect(config.get(['TEST3', 'TEST'], 'not found')).to.equal(1);
    })

    it('Has multiple', function () {
        expect(config.has(['TEST3', 'TEST2', 'TEST'])).to.equal(true);
        expect(config.has(['TEST3', 'TEST'])).to.equal(true);
        expect(config.has(['TEST3'])).to.equal(false);
    })

    it('Return default value', function () {
        expect(config.get(['test4'], 'default')).to.equal('default');
    })

    it('Throw error', function () {
        try {
            config.get(['test4'], null, true);
        } catch (error) {
            expect(error).to.be.an('error');
        }
    })
});
