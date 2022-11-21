const devConf = require('../');

const newConfig = {
    test1: {
        test2: {
            test3: 'test3',
            test4: 'test4'
        },
        test4: {
            test3: 'test3'
        }
    },
    test4: {
        test2: {
            test3: 'test3'
        }
    },
    test5: {
        test6: {
            test7: 'test7'
        }
    }
};
devConf.setConfiguration(newConfig);
devConf.setBlowOnFuse();
devConf.fuseAll();
devConf.setConfiguration(newConfig);
console.log(JSON.stringify(devConf.get(), null, '  '));