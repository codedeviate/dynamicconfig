const expect = require('chai').expect;
const dynamicConfig = require('../index.js');
const { DynamicConfig } = require('../index.js');

describe('Nightmare testing', function () {
    const config = new DynamicConfig();
    this.beforeEach(function () {
        config.setConfiguration({});
        config.set('TEST', 1);
        config.set('TEST2', 'test');
    });

    it('Test where we manipulate process.argv[1]', function () {
        const oldCONFIG_PATH = process.env.CONFIG_PATH
        delete(process.env.CONFIG_PATH);
        const oldArgv1 = process.argv[1];
        if (process.argv[1].indexOf('node_modules') > -1) {
            process.argv[1] = process.argv[1].substring(0, process.argv[1].indexOf('node_modules') - 1)
        }
        process.argv[1] += '/tests/config/';
        const config1 = new DynamicConfig();
        process.argv[1] = '/';
        const config2 = new DynamicConfig();
        process.env.CONFIG_PATH = '/non-existing-path'
        try {
            const config3 = new DynamicConfig();
        } catch (error) {
            expect(error).to.be.an('error');
        }
        process.argv[1] = oldArgv1;
        process.env.CONFIG_PATH = oldCONFIG_PATH;
    })

    it('Testing CONFIG_FILE', function () {
        const oldCONFIG_FILE = process.env.CONFIG_FILE;
        process.env.CONFIG_FILE = 'test.json';
        const config1 = new DynamicConfig();
        expect(config1.get('test')).to.equal('yes');
        process.env.CONFIG_FILE = '/test.json';
        const config2 = new DynamicConfig();
        expect(config2.get("test")).to.equal("yes");
        process.env.CONFIG_FILE = process.release.sourceUrl;
        try {
            const config3 = new DynamicConfig();
        } catch (error) {
            expect(error).to.be.an('error');
        }
        process.env.CONFIG_FILE = oldCONFIG_FILE;
    })
});