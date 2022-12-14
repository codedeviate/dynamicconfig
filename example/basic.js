const dynConf = require( '../index.js');
console.log('Get values from DynamicConfig');
console.log('test1.test2.test3 = ', dynConf.get('test1.test2.test3', 'not found'));
console.log('test1.test2.test4 = ', dynConf.get('test1.test2.test4', 'not found'));
console.log('test1.test4.test3 = ', dynConf.get('test1.test4.test3', 'not found'));
console.log('test4.test2.test3 = ', dynConf.get('test4.test2.test3', 'not found'));
console.log('test5.test6.test7 = ', dynConf.get('test5.test6.test7', 'not found'));
console.log('\nChange the configSplit to :');
dynConf.setSplit(':');
console.log(dynConf.get('test1:test2:test3', 'not found'));
console.log("\nChange the configSplit back to .");
dynConf.setSplit('.');
console.log('\nCheck if values are in DynamicConfig');
console.log('Does test1.test2.test3 exist', dynConf.has('test1.test2.test3'));
console.log('Does test1.test2.test4 exist', dynConf.has('test1.test2.test4'));
console.log('Does test1.test4.test3 exist', dynConf.has('test1.test4.test3'));
console.log('Does test4.test2.test3 exist', dynConf.has('test4.test2.test3'));
console.log('Does test5.test6.test7 exist', dynConf.has('test5.test6.test7'));
dynConf.set('testA.testB.testC', 'test');
console.log('Show the entire config', JSON.stringify(dynConf.getConfig(), undefined, "  "));
dynConf.addFuse('testA.testB.testC');
dynConf.addFuse('testA.testB.testC', 'testA.testB.testD');
dynConf.addFuse(['testA.testB.testC', 'testA.testB.testD']);
try {
  dynConf.set('testA.testB.testC', 'another test');
} catch (e) {
  console.log('Error: ', e.message);
}
console.log("List all fuseable keys");
dynConf.listFuseable((key) => {
    console.log('- ', key);
})