var store= require('../');
var Store= store.interface;
var util= require('util');
var fs= require('fs');
var FS= require('q-io/fs');

var FileStore= function (filePath) {
	var self= this;
	self.filePath= filePath;
}

util.inherits(FileStore, Store);

FileStore.prototype.get = function(key) {
	var self= this;
	return FS.read(self.filePath)
			 .then(function (content) {
			 	var obj= (content)?JSON.parse(content):{};
			 	return obj[key];
			 })
};

FileStore.prototype.set = function(key, value) {
	var self= this;
	var content= fs.readFileSync(self.filePath, 'utf8');

	// check if content is empty
	// if it's empty, it will cause problem when JSON.parse
	if(!content)
		var store= {};
	else
		var store= JSON.parse(content);

	// set value
	store[key]= value;
	return FS.write(self.filePath, JSON.stringify(store));
};

FileStore.prototype.destroy = function(key) {
	var self= this;
	var content= fs.readFileSync(self.filePath, 'utf8');

	// empty, no need to do anything
	if(!content)
		return;

	var store= JSON.parse(content);
	delete store[key];
	return FS.write(self.filePath, JSON.stringify(store));
};

FileStore.prototype.drop = function() {
	var self= this;
	return FS.write(self.filePath, '');
};

module.exports= FileStore;
