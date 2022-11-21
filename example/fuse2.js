const devConf = require('../');
devConf.setBlowOnFuse();
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3071);
console.log('PORT :', devConf.get('PORT', 3070));
devConf.addFuse('PORT');
console.log('PORT :', devConf.get('PORT', 3070));
devConf.set('PORT', 3072);
console.log('PORT :', devConf.get('PORT', 3070));
