exports.read= function (key, stores) {
	return iterUntil(stores);
}

function iterUntil (arr) {
	var getValue= arr.shift().get;
	return Q.when(getValue).then(function (value) {
		if(value || arr.length==0) return value;
		return iterUntil(arr);
	})
}