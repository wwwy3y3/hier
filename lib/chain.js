var Q= require('q');

function read(key, stores, opts) {
	if(opts.writeMissing)
		opts.writeStores= [];
	return iterUntil(key, stores, opts);
}

function iterUntil (key, arr, opts) {
	var store= arr.shift();
	var getValue= store.get(key);

	// get value from store
	return Q.when(getValue).then(function (value) {
		// find a value, and no writeMissing, just return it
		if(value && !needWriteMiss(opts))
			return value;

		// got a value, but still need to writeMissing
		if(value && needWriteMiss(opts)){
			// if opts.writeMissing true, we write value to missing store
			// if provided opts.writeCb, we return value first
			// and writeMissing come after that with callback write
			if(!opts.writeCb)
				return writeAll(opts.writeStores, key, value).then(function () {
					return value;
				})
			else{
				// async
				writeAll(opts.writeStores, key, value).then(opts.writeCb);
				return value;
			}
		}

		// no more store left and no value found
		if(!value && arr.length==0)
			return null;

		// go to next store to find out value
		// value missing in this store
		// if opts.writeMissing true, put shifted store in a array
		// we add key/value after
		if(opts.writeMissing)
			opts.writeStores.push(store);

		return iterUntil(key, arr, opts);
	})
}

function writeAll (stores, key, val) {
	var tasks= stores.map(function (store) {
		return Q.when(store.set(key, val));
	})
	return Q.all(tasks);
}

function needWriteMiss (opts) {
	return (opts.writeMissing && opts.writeStores.length>0);
}

module.exports= function (stores) {
	return {
		read: function (key, opts) {
			opts= opts || {};
			return read(key, stores, opts);
		}
	}
}