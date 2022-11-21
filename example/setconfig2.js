const devConf = require('../');

const newConfig = {
    test1: "test1"
};
devConf.setConfiguration(newConfig);
const newConfig2 = {
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
devConf.fuseAll();
const success = devConf.setConfiguration(newConfig2);
console.log('How did we do?', success ? 'Success' : 'Failure');
