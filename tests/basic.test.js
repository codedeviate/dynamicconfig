const expect = require('chai').expect;
const dynamicConfig = require('../index.js');
const { DynamicConfig } = require('../index.js');

describe('Constructor testing', function () {
    it('Object', function () {
        expect(dynamicConfig).to.be.a('object');
    });

    it('Class', function () {
        expect(DynamicConfig).to.be.a('function');
    });

    it('Load json config', function () {
        process.env.CONFIG_PATH = './tests/config/';
        const config = new DynamicConfig();
        expect(config).to.be.a('object');
        expect(config.get("test")).to.equal("yes");
    });

    it('Load ini config', function () {
        process.env.CONFIG_PATH = './tests/config/';
        process.env.CONFIG_TYPE = 'ini';
        const config = new DynamicConfig();
        expect(config).to.be.a('object');
        expect(config.get("test")).to.equal("yes");
    });
});

describe('Function testing', function () {
    let config;

    this.beforeAll(function () {
        process.env.test = 'yes';

        process.env.CONFIG_PATH = './tests/config/';
        process.env.CONFIG_TYPE = 'json';
        config = new DynamicConfig();
    });

    it('setConfiguration', function () {
    });

    it('getValueKeys', function () {
        expect(config.getValueKeys()).to.be.an('array');
        expect(config.getValueKeys().length).to.greaterThan(0);
    });

    it('mergeConfiguration', function () {
    });

    it('hasEnv', function () {
        const hasEnv1 = config.hasEnv('test');
        expect(hasEnv1).to.equal(true);
        const hasEnv2 = config.hasEnv('notest')
        expect(hasEnv2).to.equal(false);
    });

    it('hasConfig', function () {
        const hasConfig1 = config.hasConfig('test');
        expect(hasConfig1).to.equal(true);
        const hasConfig2 = config.hasConfig('notest')
        expect(hasConfig2).to.equal(false);
    });

    it('has', function () {
        const has1 = config.has('test');
        expect(has1).to.equal(true);
        const has2 = config.has('notest')
        expect(has2).to.equal(false);
    });

    it('getEnv', function () {
        // Fulfilled by hasEnv
    });

    it('getConfig', function () {
        const configuration = config.get();
        expect(configuration).to.be.an('object');
        const configSplit = config.get('__configSplit');
        expect(configSplit).to.equal('.');
        const test = config.get('test', 'default');
        expect(test).to.equal('yes');
        const test2 = config.get('test2', 'default');
        expect(test2).to.equal('default');
    });

    it('get', function () {
        const test = config.get('sub.test', 'default');
        expect(test).to.equal(2);
        const test2 = config.get('sub.test2', 'default');
        expect(test2).to.equal('default');
        try {
            const test3 = config.get('sub.test3', 'default', true);
            expect(test3).to.be.an('error');
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('getAsString', function () {
        const test = config.getAsString('sub.test', 'default');
        expect(test).to.equal('2');
        const test2 = config.getAsString('sub.sub.null', 'default');
        expect(test2).to.equal('');
    });

    it('getAsInt', function () {
        const test = config.getAsInt('sub.test', 'default');
        expect(test).to.equal(2);
        const test2 = config.getAsInt('sub.sub.null', 'default');
        expect(test2).to.equal(0);
        const test3 = config.getAsInt('sub.sub.test', 'default');
        expect(test3).to.equal(1);
        const test4 = config.getAsInt('test', 'default');
        expect(test4).to.equal(0);
        const test5 = config.getAsInt('sub.sub.int', 'default');
        expect(test5).to.equal(3);
    });

    it('getAsFloat', function () {
        const test = config.getAsFloat('sub.test', 'default');
        expect(test).to.equal(2);
        const test2 = config.getAsFloat('sub.sub.null', 'default');
        expect(test2).to.equal(0);
        const test3 = config.getAsFloat('sub.sub.test', 'default');
        expect(test3).to.equal(1);
        const test4 = config.getAsFloat('test', 'default');
        expect(test4).to.equal(0);
        const test5 = config.getAsFloat('sub.sub.int', 'default');
        expect(test5).to.equal(3);
    });

    it('getAsBoolean', function () {
        const test = config.getAsBoolean('sub.test', 'default');
        expect(test).to.equal(true);
        const test2 = config.getAsBoolean('sub.sub.null', 'default');
        expect(test2).to.equal(false);
        const test3 = config.getAsBoolean('sub.sub.test', 'default');
        expect(test3).to.equal(true);
        const test4 = config.getAsBoolean('test', 'default');
        expect(test4).to.equal(true);
        const test5 = config.getAsBoolean('sub.sub.int', 'default');
        expect(test5).to.equal(true);
    });

    it('set', function () {
        config.set('test', 'no');
        config.addFuse('test');
        config.set('test', 'yes');
        config.setBlowOnFuse(true);
        try {
            config.set('test', 'yes');
        } catch (error) {
            expect(error).to.be.an('error');
        }
        config.set("new", "value");
        expect(config.get("new")).to.equal('value');
        config.set("new");
        expect(config.get("new", "dummy")).to.equal('dummy');

        config.set("a.b.c", "1.2.3");
    });

    it('set numeric key', function () {
        const config2 = new DynamicConfig();
        config2.set(2, 'no');
        config2.addFuse(2);
        config2.set(2, 'yes');
        config2.setBlowOnFuse(true);
        try {
            config2.set(2, 'yes');
        } catch (error) {
            expect(error).to.be.an('error');
        }
        expect(config2.get(2)).to.equal('no');
    });

    it('envPopulate', function () {
        config.envPopulate('subsub');
        expect(config.getEnv('subsub')[0]).to.equal("test");
        config.envPopulate('sub.sub');
        expect(config.getEnv('test')[0]).to.equal("yes");
        expect(config.getEnv('null')[0]).to.equal("null");
        expect(config.getEnv('int')[0]).to.equal("3");
    });

    it('addFuse', function () {
        process.env.CONFIG_PATH = './tests/config/';
        process.env.CONFIG_TYPE = 'json';
        const config2 = new DynamicConfig();
        config2.addFuse('test');
        config2.set('test', 'no');
        expect(config2.get('test')).to.equal('yes');
        config2.addFuse(['test', 'sub.sub.test']);
        config2.set('sub.sub.test', 'no');
        expect(config2.get('sub.sub.test')).to.equal(true);
        config2.set(2, 'yes');
        config2.addFuse(2);
        config2.set(2, 'no');
        expect(config2.get(2)).to.equal('yes');
    });

    it('fuseAll', function () {
        process.env.CONFIG_PATH = './tests/config/';
        process.env.CONFIG_TYPE = 'json';
        const config2 = new DynamicConfig();
        config2.fuseAll();
        expect(config2.get('test')).to.equal('yes');
        config2.set('test', 'no');
        expect(config2.get('test')).to.equal('yes');
    });

    it('listFuseable', function () {
        const list = [];
        config.listFuseable((key) => {
            list.push(key);
        });
        expect(list).to.be.an('array');
        expect(list.length).to.greaterThan(0);
        expect(JSON.stringify(list)).to.equal(JSON.stringify([
            'test',
            'sub',
            'sub.test',
            'sub.sub',
            'sub.sub.test',
            'sub.sub.null',
            'sub.sub.int',
            'subsub',
            'a',
            'a.b',
            'a.b.c'
          ]));
    });

    it('setBlowOnFuse', function () {
        const config2 = new DynamicConfig();
        expect(config2.blowOnFuse()).to.equal(false);
        config2.setBlowOnFuse(true);
        expect(config2.blowOnFuse()).to.equal(true);
    });

    it('blowOnFuse', function () {
        config.setBlowOnFuse(true);
        expect(config.blowOnFuse()).to.equal(true);
    });

    it('getSplit', function () {
        expect(config.getSplit()).to.equal('.');
    });

    it('setSplit', function () {
        config.setSplit(':');
        expect(config.getSplit()).to.equal(':');
    });
})