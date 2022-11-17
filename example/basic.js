import {EnvConfig} from '../index.js';
const envConfig = new EnvConfig();
console.log("Get values from EnvConfig")
console.log('test1.test2.test3 = ', envConfig.get('test1.test2.test3', 'not found'));
console.log('test1.test2.test4 = ', envConfig.get('test1.test2.test4', 'not found'));
console.log('test1.test4.test3 = ', envConfig.get('test1.test4.test3', 'not found'));
console.log('test4.test2.test3 = ', envConfig.get('test4.test2.test3', 'not found'));
console.log('test5.test6.test7 = ', envConfig.get('test5.test6.test7', 'not found'));
console.log("\nChange the configSplit to :")
envConfig.setSplit(':');
console.log(envConfig.get('test1:test2:test3', 'not found'));
console.log("\nChange the configSplit back to .")
envConfig.setSplit('.');
console.log("\nCheck if values are in EnvConfig")
console.log('Does test1.test2.test3 exist', envConfig.has('test1.test2.test3'));
console.log('Does test1.test2.test4 exist', envConfig.has('test1.test2.test4'));
console.log('Does test1.test4.test3 exist', envConfig.has('test1.test4.test3'));
console.log('Does test4.test2.test3 exist', envConfig.has('test4.test2.test3'));
console.log('Does test5.test6.test7 exist', envConfig.has('test5.test6.test7'));
