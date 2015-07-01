var hier= require('../');
var Q= require('q');
var FileStore= require('./fileStore');
var MemoryStore= require('../lib/memoryStore');
var VirtualStore= require('./virtualStore');
var path= require('path');
var should= require('should');
var fs= require('fs');
var _= require('lodash');

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
		.catch(console.error)
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
			.catch(console.error)
		})

		it('should get value', function () {
			return fileStore.get('where')
			.then(function (value) {
				value.should.equal('file');
			})
			.catch(console.error)
		})
	})

	describe('#chain', function () {
		it('should get value from memoryStore', function () {
			return hier.chain([ memoryStore, fileStore ]).read('where')
			.then(function (value) {
				value.should.equal('memory');
			})
			.catch(console.error)
		})

		it('should get value from fileStore', function () {
			// mvp value only exist in fileStore
			return hier.chain([ memoryStore, fileStore ]).read('mvp')
			.then(function (value) {
				(memoryStore.get('mvp') === null).should.be.true;
				value.should.equal('curry');
			})
			.catch(console.error)
		})

		it('should cache values in stores under opts.writeMissing', function () {
			var opts= { writeMissing: true };
			return hier.chain([ memoryStore, otherMemoryStore, fileStore ])
			.read('mvp', opts)
			.then(function (value) {
				value.should.equal('curry');

				// cache
				memoryStore.get('mvp').should.equal('curry');
				otherMemoryStore.get('mvp').should.equal('curry');
			})
			.catch(console.error)
		})

		it('should cache values async using opts.writeCb', function (done) {
			var opts= { 
				writeMissing: true,
				writeCb: function (result) {
					virtualStore.stores.fmvp.should.equal('iggy');
					done();
				}
			};
			return hier.chain([ memoryStore, otherMemoryStore, virtualStore, fileStore ])
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
			.catch(console.error)
		})


		it('should cache values async using opts.writeCb and use custom get fn', function (done) {
			var opts= { 
				writeMissing: true,
				writeCb: function (result) {
					virtualStore.stores.sas.should.equal('spurs');
					done();
				}
			};
			var dbGet= function (key) {
				var obj= {
					sas: 'spurs'
				}
				return obj[key];
			}
			var otherGet= function (key) {
				var obj= {}
				return obj[key];
			}
			return hier.chain([ memoryStore, otherMemoryStore, virtualStore, otherGet, dbGet ])
			.read('sas', opts)
			.then(function (value) {
				value.should.equal('spurs');

				// cache
				memoryStore.get('sas').should.equal('spurs');
				otherMemoryStore.get('sas').should.equal('spurs');

				// see virtualStore, since the callback is delayed
				// sas should be null
				(_.isUndefined(virtualStore.stores.sas)).should.be.true;
			})
			.catch(console.error)
		})
	})
})