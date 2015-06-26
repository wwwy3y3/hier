var store= require('../');
var Q= require('q');
var FileStore= require('./fileStore');
var MemoryStore= require('../lib/memoryStore');
var path= require('path');

// instance
var filePath= path.resolve(__dirname, 'store.json');
var fileStore= new FileStore(filePath);
var memoryStore= new MemoryStore();

// set values
memoryStore.set('player', 'mj');
fileStore.set('player', 'frank')
.then(function () {
	return fileStore.set('pg', 'cp3')
})

.then(function () {
	// chain of read
	var opts= { writeMissing: true };
	return store.chain([ memoryStore, fileStore ]).read('pg', opts)
})

.then(console.log).catch(console.error)
