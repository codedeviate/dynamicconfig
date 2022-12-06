const devConf = require('../');

const newConfig = {
    test1: '1.1',
    test2: 1.2,
    test3: 1.3,
    test4: '1,4',
    test5: 'Text 1.5',
    test6: false,
    test7: true,
    test8: null,
    test9: { a: 1, b: 2, c: 3 },
    test10: [1, 2, 3]
};

devConf.setConfiguration(newConfig);

console.log(devConf.get('test1'), 'becomes', devConf.getAsString('test1'), 'as a string');
console.log(devConf.get('test2'), 'becomes', devConf.getAsString('test2'), 'as a string');
console.log(devConf.get('test3'), 'becomes', devConf.getAsString('test3'), 'as a string');
console.log(devConf.get('test4'), 'becomes', devConf.getAsString('test4'), 'as a string');
console.log(devConf.get('test5'), 'becomes', devConf.getAsString('test5'), 'as a string');
console.log(devConf.get('test6'), 'becomes', devConf.getAsString('test6'), 'as a string');
console.log(devConf.get('test7'), 'becomes', devConf.getAsString('test7'), 'as a string');
console.log(devConf.get('test8'), 'becomes', devConf.getAsString('test8'), 'as a string');
console.log(devConf.get('test9'), 'becomes', devConf.getAsString('test9'), 'as a string');
console.log(devConf.get('test10'), 'becomes', devConf.getAsString('test10'), 'as a string');
console.log("")
console.log(devConf.get('test1'), 'becomes', devConf.getAsInt('test1'), 'as an integer');
console.log(devConf.get('test2'), 'becomes', devConf.getAsInt('test2'), 'as an integer');
console.log(devConf.get('test3'), 'becomes', devConf.getAsInt('test3'), 'as an integer');
console.log(devConf.get('test4'), 'becomes', devConf.getAsInt('test4'), 'as an integer');
console.log(devConf.get('test5'), 'becomes', devConf.getAsInt('test5'), 'as an integer');
console.log(devConf.get('test6'), 'becomes', devConf.getAsInt('test6'), 'as an integer');
console.log(devConf.get('test7'), 'becomes', devConf.getAsInt('test7'), 'as an integer');
console.log(devConf.get('test8'), 'becomes', devConf.getAsInt('test8'), 'as an integer');
console.log(devConf.get('test9'), 'becomes', devConf.getAsInt('test9'), 'as an integer');
console.log(devConf.get('test10'), 'becomes', devConf.getAsInt('test10'), 'as an integer');
console.log("")
console.log(devConf.get('test1'), 'becomes', devConf.getAsFloat('test1'), 'as a float');
console.log(devConf.get('test2'), 'becomes', devConf.getAsFloat('test2'), 'as a float');
console.log(devConf.get('test3'), 'becomes', devConf.getAsFloat('test3'), 'as a float');
console.log(devConf.get('test4'), 'becomes', devConf.getAsFloat('test4'), 'as a float');
console.log(devConf.get('test5'), 'becomes', devConf.getAsFloat('test5'), 'as a float');
console.log(devConf.get('test6'), 'becomes', devConf.getAsFloat('test6'), 'as a float');
console.log(devConf.get('test7'), 'becomes', devConf.getAsFloat('test7'), 'as a float');
console.log(devConf.get('test8'), 'becomes', devConf.getAsFloat('test8'), 'as a float');
console.log(devConf.get('test9'), 'becomes', devConf.getAsFloat('test9'), 'as a float');
console.log(devConf.get('test10'), 'becomes', devConf.getAsFloat('test10'), 'as a float');
