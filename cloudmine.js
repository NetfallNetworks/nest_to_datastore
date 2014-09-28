
function Cloudmine(app_id, api_key) {
	
	var cloudmine = require('cloudmine');
	var ws = new cloudmine.WebService({
	  appid: app_id,
	  apikey: api_key
	});
	
	this.pushData = function(data) {
		ws.set(null, data).on('error', function(data, response) {
		  console.log(data);
		});
	};
	
	this.addDataPrefix = function(data, prefix) {
		for (var element in data) {
			if (data.hasOwnProperty(element)) {
				data[element].name = prefix + data[element].name;
			}
		}
	};
	
	this.addTags = function(data, tags) {
		for (var element in tags) {
			if (tags.hasOwnProperty(element)) {
				data[element] = tags[element];
			}
		}
	};
}

module.exports = Cloudmine;