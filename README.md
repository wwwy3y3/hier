# Hier
[![Build Status](https://travis-ci.org/wwwy3y3/hier.svg?branch=master)](https://travis-ci.org/wwwy3y3/hier)

provide hierarchical read from different data resources, e.g, db, cache, file system...

``` javascript
// hierarchical read from memoryStore, fileStore
hier.chain([ memoryStore, fileStore ]).read('key').then(function(value){
	// ...
})
```

## api
### Store interface
every get/set value operations in this module, rely on this `Store interface`

so if you want to create your own `Store class`, be sure to inherit fron `Store`
#### example
``` javascript
var hier= require('../');
var Store= hier.interface;
var util= require('util');
var Q= require('q');

var VirtualStore= function () {
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
```


### chain
hierarchical read from `memoryStore`, `fileStore`

read `key` in order from `memoryStore`, `fileStore`

``` javascript
hier.chain([ memoryStore, fileStore ]).read('key')
	.then(function (value) {
		//...
	})
```

## License
MIT