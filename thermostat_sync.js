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

function merge(o1, o2) {
	o1 = o1 || {};
	if (!o2) {
		return o1;
	}
	for (var p in o2) {
		o1[p] = o2[p];
	}
	return o1;
}

if (process.argv.length < 6) {
	console.log('Usage: ' + process.argv[1] + ' USERNAME PASSWORD APP_ID API_KEY');
	console.log('');
	console.log('USERNAME and PASSWORD should be enclosed in quotes.');
	console.log('');

	process.exit(1);
	// failure to communicate with user app requirements. :)
}

var username = process.argv[2];
var password = process.argv[3];
var app_id = process.argv[4];
var api_key = process.argv[5];
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

	nest.fetchStatus(function(data) {
		for (var deviceId in data.device) {
			if (data.device.hasOwnProperty(deviceId)) {
				var device = data.shared[deviceId];
				nest.setTemperature(deviceId, nest.ctof(device.target_temperature));
			}
		}
	});
	nest.fetchStatus(function(data) {
		for (var deviceId in data.device) {
			if (data.device.hasOwnProperty(deviceId)) {
				var device = data.shared[deviceId];
				var online = data.track[deviceId].online;
				console.log(util.format("%s [%s], Current temperature = %d F target=%d", device.name, deviceId, nest.ctof(device.current_temperature), nest.ctof(device.target_temperature)));

				deviceTags = {
					"device_name" : device.name,
					"device_id" : deviceId,
					"device_version" : device['$timestamp']
				};
				deviceTimestamp = device['$timestamp'];
				//console.log(deviceTimestamp);
				var logData = [];
				//console.log(data);
				//console.log(device);
				//console.log(data.device[deviceId].current_humidity);

				//console.log(data.track[deviceId].online);

				current_humidity = {};
				current_humidity.name = 'current_humidity';
				current_humidity.value = data.device[deviceId].current_humidity;
				current_humidity.timestamp = deviceTimestamp;
				// current_humidity.tags = deviceTags;
				logData.push(current_humidity);

				auto_away = {};
				auto_away.name = 'auto_away';
				auto_away.value = device[auto_away.name];
				auto_away.timestamp = deviceTimestamp;
				// auto_away.tags = deviceTags;
				logData.push(auto_away);

				hvac_heat_x3_state = {};
				hvac_heat_x3_state.name = 'hvac_heat_x3_state';
				hvac_heat_x3_state.value = device[hvac_heat_x3_state.name] ? 1 : 0;
				hvac_heat_x3_state.timestamp = deviceTimestamp;
				// hvac_heat_x3_state.tags = deviceTags;
				logData.push(hvac_heat_x3_state);

				compressor_lockout_enabled = {};
				compressor_lockout_enabled.name = 'compressor_lockout_enabled';
				compressor_lockout_enabled.value = device[compressor_lockout_enabled.name] ? 1 : 0;
				compressor_lockout_enabled.timestamp = deviceTimestamp;
				// compressor_lockout_enabled.tags = deviceTags;
				logData.push(compressor_lockout_enabled);

				hvac_alt_heat_state = {};
				hvac_alt_heat_state.name = 'hvac_alt_heat_state';
				hvac_alt_heat_state.value = device[hvac_alt_heat_state.name] ? 1 : 0;
				hvac_alt_heat_state.timestamp = deviceTimestamp;
				// hvac_alt_heat_state.tags = deviceTags;
				logData.push(hvac_alt_heat_state);

				// need to create an enum and send an integer value
				//target_temperature_type = {};
				//target_temperature_type.name = 'target_temperature_type';
				//target_temperature_type.value = device[target_temperature_type.name];
				//target_temperature_type.timestamp = deviceTimestamp;
				//target_temperature_type.tags = deviceTags;
				//logData.push(target_temperature_type);

				hvac_heater_state = {};
				hvac_heater_state.name = 'hvac_heater_state';
				hvac_heater_state.value = device[hvac_heater_state.name] ? 1 : 0;
				hvac_heater_state.timestamp = deviceTimestamp;
				// hvac_heater_state.tags = deviceTags;
				logData.push(hvac_heater_state);

				hvac_emer_heat_state = {};
				hvac_emer_heat_state.name = 'hvac_emer_heat_state';
				hvac_emer_heat_state.value = device[hvac_emer_heat_state.name] ? 1 : 0;
				hvac_emer_heat_state.timestamp = deviceTimestamp;
				// hvac_emer_heat_state.tags = deviceTags;
				logData.push(hvac_emer_heat_state);

				can_heat = {};
				can_heat.name = 'can_heat';
				can_heat.value = device[can_heat.name] ? 1 : 0;
				can_heat.timestamp = deviceTimestamp;
				// can_heat.tags = deviceTags;
				logData.push(can_heat);

				compressor_lockout_timeout = {};
				compressor_lockout_timeout.name = 'compressor_lockout_timeout';
				compressor_lockout_timeout.value = device[compressor_lockout_timeout.name];
				compressor_lockout_timeout.timestamp = deviceTimestamp;
				// compressor_lockout_timeout.tags = deviceTags;
				logData.push(compressor_lockout_timeout);

				hvac_cool_x2_state = {};
				hvac_cool_x2_state.name = 'hvac_cool_x2_state';
				hvac_cool_x2_state.value = device[hvac_cool_x2_state.name] ? 1 : 0;
				hvac_cool_x2_state.timestamp = deviceTimestamp;
				// hvac_cool_x2_state.tags = deviceTags;
				logData.push(hvac_cool_x2_state);

				target_temperature_high = {};
				target_temperature_high.name = 'target_temperature_high';
				target_temperature_high.value = device[target_temperature_high.name];
				target_temperature_high.timestamp = deviceTimestamp;
				// target_temperature_high.tags = deviceTags;
				logData.push(target_temperature_high);

				hvac_aux_heater_state = {};
				hvac_aux_heater_state.name = 'hvac_aux_heater_state';
				hvac_aux_heater_state.value = device[hvac_aux_heater_state.name] ? 1 : 0;
				hvac_aux_heater_state.timestamp = deviceTimestamp;
				// hvac_aux_heater_state.tags = deviceTags;
				logData.push(hvac_aux_heater_state);

				hvac_heat_x2_state = {};
				hvac_heat_x2_state.name = 'hvac_heat_x2_state';
				hvac_heat_x2_state.value = device[hvac_heat_x2_state.name] ? 1 : 0;
				hvac_heat_x2_state.timestamp = deviceTimestamp;
				// hvac_heat_x2_state.tags = deviceTags;
				logData.push(hvac_heat_x2_state);

				target_temperature_low = {};
				target_temperature_low.name = 'target_temperature_low';
				target_temperature_low.value = device[target_temperature_low.name];
				target_temperature_low.timestamp = deviceTimestamp;
				// target_temperature_low.tags = deviceTags;
				logData.push(target_temperature_low);

				hvac_ac_state = {};
				hvac_ac_state.name = 'hvac_ac_state';
				hvac_ac_state.value = device[hvac_ac_state.name] ? 1 : 0;
				hvac_ac_state.timestamp = deviceTimestamp;
				// hvac_ac_state.tags = deviceTags;
				logData.push(hvac_ac_state);

				target_temperature = {};
				target_temperature.name = 'target_temperature';
				target_temperature.value = device[target_temperature.name];
				target_temperature.timestamp = deviceTimestamp;
				// target_temperature.tags = deviceTags;
				logData.push(target_temperature);

				hvac_fan_state = {};
				hvac_fan_state.name = 'hvac_fan_state';
				hvac_fan_state.value = device[hvac_fan_state.name] ? 1 : 0;
				hvac_fan_state.timestamp = deviceTimestamp;
				// hvac_fan_state.tags = deviceTags;
				logData.push(hvac_fan_state);

				target_change_pending = {};
				target_change_pending.name = 'target_change_pending';
				target_change_pending.value = device[target_change_pending.name] ? 1 : 0;
				target_change_pending.timestamp = deviceTimestamp;
				// target_change_pending.tags = deviceTags;
				logData.push(target_change_pending);

				current_temperature = {};
				current_temperature.name = 'current_temperature';
				current_temperature.value = device[current_temperature.name];
				current_temperature.timestamp = deviceTimestamp;
				// current_temperature.tags = deviceTags;
				logData.push(current_temperature);

				hvac_alt_heat_x2_state = {};
				hvac_alt_heat_x2_state.name = 'hvac_alt_heat_x2_state';
				hvac_alt_heat_x2_state.value = device[hvac_alt_heat_x2_state.name] ? 1 : 0;
				hvac_alt_heat_x2_state.timestamp = deviceTimestamp;
				// hvac_alt_heat_x2_state.tags = deviceTags;
				logData.push(hvac_alt_heat_x2_state);

				can_cool = {};
				can_cool.name = 'can_cool';
				can_cool.value = device[can_cool.name] ? 1 : 0;
				can_cool.timestamp = deviceTimestamp;
				// can_cool.tags = deviceTags;
				logData.push(can_cool);

				if (online) {
					// console.log(logData);
					cloudmineServer.addDataPrefix(logData, "nest.device.");
					logData.forEach(function(element) {		
						cloudmineServer.addTags(element, deviceTags);						
						console.log(element);
						cloudmineServer.pushData(element);
					});
					// kairosServer.addDataPrefix(logData, "nest.device.");
					// kairosServer.pushData(logData);

				}

			}

		}

	});
}

