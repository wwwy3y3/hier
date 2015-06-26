var store= require('../');
var Q= require('q');
var FileStore= require('./fileStore');
var MemoryStore= require('../lib/memoryStore');
var path= require('path');
var should= require('should');

/*
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

.then(function (value) {
	console.log(value);
	console.log(memoryStore);
}).catch(console.error)
*/

describe('api', function () {
	var filePath= path.resolve(__dirname, 'store.json');
	var fileStore= new FileStore(filePath);
	var memoryStore= new MemoryStore();

	before(function() {
		// clear the store.json first
		return fileStore.drop();
	})

	describe('#MemoryStore', function () {

		it('should set value', function () {
			memoryStore.set('where', 'memory');
			memoryStore.get('where').should.equal('memory');
		})

		it('should get value', function () {
			memoryStore.get('where').should.equal('memory');
		})
	})
})