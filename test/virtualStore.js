var hier= require('../');
var Store= hier.interface;
var util= require('util');
var Q= require('q');

var VirtualStore= function () {
	// MemoryStore
	var self= this;
	self.stores= {};
	Store.call(self);
}

util.inherits(VirtualStore, Store);

VirtualStore.prototype.get = function(key) {
	var self= this;
	return Q.delay(100).then(function () {
		return self.stores[key] || null;
	})
};

VirtualStore.prototype.set = function(key, value, opts) {
	var self= this;
	return Q.delay(100).then(function () {
		self.stores[key]= value;
	})	
};

VirtualStore.prototype.destroy = function(key) {
	delete self.stores[key];
};

module.exports= VirtualStore;