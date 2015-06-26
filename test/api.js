var store= require('../');
var Q= require('q');
var FileStore= require('./fileStore');
var MemoryStore= require('../lib/memoryStore');
var VirtualStore= require('./virtualStore');
var path= require('path');
var should= require('should');
var fs= require('fs');

describe('api', function () {
	var filePath= path.resolve(__dirname, 'store.json');
	var fileStore= new FileStore(filePath);
	var memoryStore= new MemoryStore();
	var otherMemoryStore= new MemoryStore();
	var virtualStore= new VirtualStore();

	before(function() {
		// clear the store.json first
		// check if storing file exist
		var bool= fs.existsSync(filePath);
		if(!bool) fs.writeFileSync(filePath, '');
		return fileStore.drop()
		.then(function () {
			return fileStore.set({ mvp: 'curry', fmvp: 'iggy' });
		})
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

	describe('#fileStore', function () {
		it('should set value', function () {
			return fileStore.set('where', 'file')

			.then(function () {
				return fileStore.get('where');
			})

			.then(function (value) {
				value.should.equal('file');
			})
		})

		it('should get value', function () {
			return fileStore.get('where')
			.then(function (value) {
				value.should.equal('file');
			})
		})
	})

	describe('#chain', function () {
		it('should get value from memoryStore', function () {
			return store.chain([ memoryStore, fileStore ]).read('where')
			.then(function (value) {
				value.should.equal('memory');
			})
		})

		it('should get value from fileStore', function () {
			// mvp value only exist in fileStore
			return store.chain([ memoryStore, fileStore ]).read('mvp')
			.then(function (value) {
				(memoryStore.get('mvp') === null).should.be.true;
				value.should.equal('curry');
			})
		})

		it('should cache values in stores under opts.writeMissing', function () {
			var opts= { writeMissing: true };
			return store.chain([ memoryStore, otherMemoryStore, fileStore ])
			.read('mvp', opts)
			.then(function (value) {
				value.should.equal('curry');

				// cache
				memoryStore.get('mvp').should.equal('curry');
				otherMemoryStore.get('mvp').should.equal('curry');
			})
		})

		it('should cache values async using opts.writeCb', function (done) {
			var opts= { 
				writeMissing: true,
				writeCb: function (result) {
					virtualStore.stores.fmvp.should.equal('iggy');
					done();
				}
			};
			return store.chain([ memoryStore, otherMemoryStore, virtualStore, fileStore ])
			.read('fmvp', opts)
			.then(function (value) {
				value.should.equal('iggy');

				// cache
				memoryStore.get('fmvp').should.equal('iggy');
				otherMemoryStore.get('fmvp').should.equal('iggy');

				// see virtualStore, since the callback is delayed
				// fmvp should be null
				(_.isUndefined(virtualStore.stores.fmvp)).should.be.true;
			})
		})
	})
})