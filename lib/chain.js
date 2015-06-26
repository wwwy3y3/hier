var Q= require('q');

function read(key, stores, opts) {
	if(opts.writeMissing)
		opts.writeStores= [];
	return iterUntil(key, stores, opts);
}

function iterUntil (key, arr, opts) {
	var store= arr.shift();
	var getValue= store.get(key);
	// if opts.writeMissing true, put shifted store in a array
	// we add key/value after
	if(opts.writeMissing)
		opts.writeStores.push(store);

	// get value from store
	return Q.when(getValue).then(function (value) {
		// find a value, or 
		if(value){
			// if opts.writeMissing true, we write value to missing store
			if(opts.writeMissing && opts.writeStores.length>0)
				return writeAll(opts.writeStores, key, value).then(function () {
					return value;
				})

			// no writeMissing, just return
			return value;
		}

		// no more store left and no value found
		if(!value && arr.length==0)
			return null;

		// go to next store to find out value
		return iterUntil(key, arr, opts);
	})
}

function writeAll (stores, key, val) {
	var tasks= stores.map(function (store) {
		return Q.when(store.set(key, val));
	})
	return Q.all(tasks);
}

module.exports= function (stores) {
	return {
		read: function (key, opts) {
			opts= opts || {};
			return read(key, stores, opts);
		}
	}
}