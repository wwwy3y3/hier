exports.read= function (stores) {
	var tasks= stores.map(function (store) {
		return function () {
			return Q.when(store);
		}
	})

	return tasks.reduce(Q.when, Q());
}