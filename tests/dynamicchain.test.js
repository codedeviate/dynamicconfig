const expect = require('chai').expect;
const dynamicConfig = require('../index.js');
const dynamicChain = require('../index.js');
const { DynamicConfig, DynamicChain } = require('../index.js');

describe('Chain testing', function () {
    const config = new DynamicConfig();
    this.beforeEach(function () {
        config.setConfiguration({});
        config.set('TEST', 1);
        config.set('TEST2', 'test');
    });

    it('Object', function () {
        expect(dynamicChain).to.be.a('object');
    });

    it('Class', function () {
        expect(DynamicChain).to.be.a('function');
    });

    it('Chain inline - is', function () {
        expect(config.chain().is("TEST", 1).result()).to.equal(true);
        expect(config.chain().is("TEST", 2).result()).to.equal(false);
    });

    it('Chain inline - multiple is', function () {
        expect(config.chain().is(["TEST", "TEST2"], 1).result()).to.equal(true);
        expect(config.chain().is(["TEST", "TEST2"], 2).result()).to.equal(false);
    });

    it('Chain inline - chained is', function () {
        expect(config.chain().is("TEST2", "test").is("TEST", 1).result()).to.equal(true);
        expect(config.chain().is("TEST2", "test").is("TEST", 2).result()).to.equal(false);
    });

    it('Chain inline - chained multiple is', function () {
        expect(config.chain().is("TEST", 1).is(["TEST", "TEST2"], 1).result()).to.equal(true);
        expect(config.chain().is("TEST", 1).is(["TEST", "TEST2"], 2).result()).to.equal(false);
    });

    it('Chain inline - isNot', function () {
        expect(config.chain().isNot("TEST", 1).result()).to.equal(false);
        expect(config.chain().isNot("TEST", 2).result()).to.equal(true);
    });

    it('Chain inline - mulitple isNot', function () {
        expect(config.chain().isNot(["TEST", "TEST2"], 1).result()).to.equal(false);
        expect(config.chain().isNot(["TEST", "TEST2"], 2).result()).to.equal(true);
    });

    it('Chain inline - chained isNot', function () {
        expect(config.chain().is("TEST2", "test").isNot("TEST", 1).result()).to.equal(false);
        expect(config.chain().is("TEST2", "test").isNot("TEST", 2).result()).to.equal(true);
    });

    it('Chain inline - chained mulitple isNot', function () {
        expect(config.chain().is("TEST", 1).isNot(["TEST", "TEST2"], 1).result()).to.equal(false);
        expect(config.chain().is("TEST", 1).isNot(["TEST", "TEST2"], 2).result()).to.equal(true);
    });

    it('Chain inline - has', function () {
        expect(config.chain().hasKey("TEST2").result()).to.equal(true);
        expect(config.chain().hasKey("TEST3").result()).to.equal(false);
    });

    it('Chain inline - multiple has', function () {
        expect(config.chain().hasKey(["TEST3", "TEST2"]).result()).to.equal(true);
        expect(config.chain().hasKey(["TEST3", "TEST4"]).result()).to.equal(false);
    });

    it('Chain inline - chained has', function () {
        expect(config.chain().is("TEST2", "test").hasKey("TEST2").result()).to.equal(true);
        expect(config.chain().is("TEST2", "test").hasKey("TEST3").result()).to.equal(false);
    });

    it('Chain inline - chained multiple has', function () {
        expect(config.chain().is("TEST", 1).hasKey(["TEST3", "TEST2"]).result()).to.equal(true);
        expect(config.chain().is("TEST", 1).hasKey(["TEST3", "TEST4"]).result()).to.equal(false);
    });

    it('Chain inline - hasNot', function () {
        expect(config.chain().hasNotKey("TEST2").result()).to.equal(false);
        expect(config.chain().hasNotKey("TEST3").result()).to.equal(true);
    });

    it('Chain inline - multiple hasNot', function () {
        expect(config.chain().hasNotKey(["TEST3", "TEST2"]).result()).to.equal(false);
        expect(config.chain().hasNotKey(["TEST3", "TEST4"]).result()).to.equal(true);
    });

    it('Chain inline - chained hasNot', function () {
        expect(config.chain().is("TEST2", "test").hasNotKey("TEST2").result()).to.equal(false);
        expect(config.chain().is("TEST2", "test").hasNotKey("TEST3").result()).to.equal(true);
    });

    it('Chain inline - chained multiple hasNot', function () {
        expect(config.chain().is("TEST", 1).hasNotKey(["TEST3", "TEST2"]).result()).to.equal(false);
        expect(config.chain().is("TEST", 1).hasNotKey(["TEST3", "TEST4"]).result()).to.equal(true);
    });

    it('Chain inline - reset', function () {
        expect(config.chain().is("TEST", 1).reset().is("TEST", 2).result()).to.equal(false);
        expect(config.chain().is("TEST", 2).reset().is("TEST", 1).result()).to.equal(true);
    });
})