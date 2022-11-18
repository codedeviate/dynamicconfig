import {DynamicConfig} from '../index.js';
const dynConf = new DynamicConfig();
console.log("Get values from DynamicConfig")
console.log('test1.test2.test3 = ', dynConf.get('test1.test2.test3', 'not found'));
console.log('test1.test2.test4 = ', dynConf.get('test1.test2.test4', 'not found'));
console.log('test1.test4.test3 = ', dynConf.get('test1.test4.test3', 'not found'));
console.log('test4.test2.test3 = ', dynConf.get('test4.test2.test3', 'not found'));
console.log('test5.test6.test7 = ', dynConf.get('test5.test6.test7', 'not found'));
console.log("\nChange the configSplit to :")
dynConf.setSplit(':');
console.log(dynConf.get('test1:test2:test3', 'not found'));
console.log("\nChange the configSplit back to .")
dynConf.setSplit('.');
console.log("\nCheck if values are in DynamicConfig")
console.log('Does test1.test2.test3 exist', dynConf.has('test1.test2.test3'));
console.log('Does test1.test2.test4 exist', dynConf.has('test1.test2.test4'));
console.log('Does test1.test4.test3 exist', dynConf.has('test1.test4.test3'));
console.log('Does test4.test2.test3 exist', dynConf.has('test4.test2.test3'));
console.log('Does test5.test6.test7 exist', dynConf.has('test5.test6.test7'));
console.log('Show the entire config', dynConf.getConfig());