var Q= require('q');

function read(key, stores) {
	return iterUntil(key, stores);
}

function iterUntil (key, arr) {
	var getValue= arr.shift().get(key);
	return Q.when(getValue).then(function (value) {
		if(value || arr.length==0) return value;
		return iterUntil(key, arr);
	})
}

module.exports= function (stores) {
	return {
		read: function (key) {
			return read(key, stores);
		}
	}
}