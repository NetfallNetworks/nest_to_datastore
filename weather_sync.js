// creating the class to pull nest data and push to kairos.db

/**
 *
 *  Demonstration for the unofficial_nest library
 *  logs in, reads status, constantly, for ever. :)
 *
 */"option strict";
var util, nest, kairos;

util = require('util');
nest = require('../unofficial_nodejs_nest/index.js');
cloudmine = require('./cloudmine.js');

function trimQuotes(s) {
	if (!s || s.length === 0) {
		return '';
	}
	var c = s.charAt(0);
	var start = (c === '\'' || c === '"') ? 1 : 0;
	var end = s.length;
	c = s.charAt(end - 1);
	end -= (c === '\'' || c === '"') ? 1 : 0;
	return s.substring(start, end);
}

if (process.argv.length < 7) {
	console.log('Usage: ' + process.argv[1] + ' USERNAME PASSWORD ZIP APP_ID API_KEY');
	console.log('');
	console.log('USERNAME and PASSWORD should be enclosed in quotes.');
	console.log('');

	process.exit(1);
	// failure to communicate with user app requirements. :)
}

var username = process.argv[2];
var password = process.argv[3];
var zip = process.argv[4];
var app_id = process.argv[5];
var api_key = process.argv[6];
var cloudmineServer = new cloudmine(app_id, api_key);

if (username && password) {
	username = trimQuotes(username);
	password = trimQuotes(password);
	nest.login(username, password, function(err, data) {
		if (err) {
			console.log(err.message);
			process.exit(1);
			return;
		}
		console.log('Logged in.');
		postToDataStore();
	});
}

function postToDataStore() {
	nest.get('/api/0.1/weather/forecast/' + zip + ',US', function(data) {
		console.log('Got weather data!');
		//console.log(data.now);
		var weatherTags = {
			"station" : data.now.station_id,
			"zip" : zip
		};
		var timestamp = Date.now();

		var logData = [];
		current_humidity = {};
		current_humidity.name = 'nest.weather.current_humidity';
		current_humidity.value = data.now.current_humidity;
		current_humidity.timestamp = timestamp;	
		logData.push(current_humidity);

		current_temperature = {};
		current_temperature.name = 'nest.weather.current_temperature';
		current_temperature.value = data.now.current_temperature;
		current_temperature.timestamp = timestamp;
		logData.push(current_temperature);

		current_wind = {};
		current_wind.name = 'nest.weather.current_wind';
		current_wind.value = data.now.current_wind;
		current_wind.timestamp = timestamp;
		logData.push(current_wind);

		// console.log(logData);
				
		//kairosServer.pushData(logData);
		logData.forEach(function(element) {		
			cloudmineServer.addTags(element, weatherTags);
			console.log(element);
			cloudmineServer.pushData(element);
		});
		
		console.log('done with weather.');
	}, 'home.nest.com');

}
