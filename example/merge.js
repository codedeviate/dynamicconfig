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

const mergeConfig = {
    test1: {
        test2: {
            test3: 'test3A',
            test4: 'test4B'
        },
        test4: {
            test3: 'test3C'
        }
    },
    test4: {
        test2: {
            test3: 'test3D'
        }
    },
    test5: {
        test6: {
            test7: 'test7E',
            test8: 'test8F'
        }
    },
    test2: {
        test3: 'test3G'
    },
    test4: 'test4H'
};
devConf.mergeConfiguration(mergeConfig);
console.log(JSON.stringify(devConf.get(), null, '  '));
