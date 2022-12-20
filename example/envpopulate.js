const devConf = require('../');
devConf.envPopulate('env');
console.log(process.env);