exports.read= function (key, stores) {
	var tasks= stores.map(function (store) {
		return function () {
			return Q.when(store.get(key));
		}
	})

	return tasks.reduce(Q.when, Q());
}