var Store= require('./store');
var util= require('util');

var MemoryStore= function () {
	// MemoryStore
	var self= this;
	self.stores= {};
	Store.call(self);
}

util.inherits(MemoryStore, Store);

MemoryStore.prototype.get = function(key) {
	var self= this;
	return self.stores[key] || null;
};

MemoryStore.prototype.set = function(key, value, opts) {
	var self= this;
	self.stores[key]= value;
};

MemoryStore.prototype.destroy = function(key) {
	delete self.stores[key];
};

module.exports= MemoryStore;