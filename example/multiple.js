const dynConf = require( '../index.js');

// Set some basic values
dynConf.set('TEST', 1);
dynConf.set('TEST2', 'test');

// Get the value of the first key available
console.log('Get the value of the first key available:', dynConf.get(['TEST3', 'TEST2', 'TEST'], 'not found'));

// Is any of the keys available
console.log("Is any of the keys available:", dynConf.has(['TEST3', 'TEST2', 'TEST']));

// Chaining
console.log("Chaining is:", dynConf.chain().is(["TEST", "TEST2"], "test").result());
console.log("Chaining isNot:", dynConf.chain().isNot(["TEST", "TEST2"], "test").result());
console.log("Chaining hasKey:", dynConf.chain().hasKey(["TEST", "TEST2"]).result());
console.log("Chaining hasNotKey:", dynConf.chain().hasNotKey(["TEST", "TEST2"]).result());