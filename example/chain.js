const dynamicConfig = require('../index.js');
const dynConf = require( '../index.js');

// Set some basic values
dynConf.set('TEST', 1);
dynConf.set('TEST2', 'test');

// Chain inline
if(dynConf.chain().is("TEST", 1).hasKey("TEST2").result()) {
    console.log("TEST1 === 1 and TEST2 is set");
}

// Another chain inline
if(dynConf.chain().is("TEST", 1).hasNotKey("TEST2").result()) {
    console.log("This should not be printed");
} else {
    console.log("TEST1 === 1 and TEST2 is not set");
}

// Chain with individual calls
const chain = dynConf.chain()
chain.is("TEST", 1)
chain.hasKey("TEST2")
if(chain.result()) {
    console.log("TEST1 === 1 and TEST2 is set");
}