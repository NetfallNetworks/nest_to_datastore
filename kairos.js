function Kairos(hostname) {
	var kairosHostname = hostname;
	var kairosPort = 80;
	var kairosUserAgent = 'Nest/3.0.15 (iOS) os=6.0 platform=iPad3,1';

	var comms = require('../unofficial_nodejs_nest/communications.js');
	
	this.kairosPost = function(settings) {
		var allData = [];
		var post_data;
		var contentType;
		var hostname, port, ssl, path, body, headers, done;

		if (typeof settings === 'function') {
			// call the function and get the results, which
			// MUST be an object (so that it's processed below)
			settings = settings();
		}

		if (settings && typeof settings === 'object') {
			hostname = settings.hostname || kairosHostname;
			port = settings.port || kairosPort;
			if ( typeof settings.ssl === 'undefined') {
				ssl = true;
			} else {
				ssl = settings.ssl;
			}
			path = settings.path;
			body = settings.body || null;
			headers = settings.headers;
			done = settings.done;
		} else {
			throw new Error("Settings I need to function properly!");
		}

		// convert to a form url encoded body
		if (typeof body !== 'string') {
			post_data = queryString.stringify(body);
			contentType = 'application/x-www-form-urlencoded; charset=utf-8';
		} else {
			post_data = body;
			contentType = 'application/json';
		}
		var options = {
			ssl : ssl,
			host : hostname,
			port : port,
			path : path,
			method : 'POST',
			headers : {
				'Content-Type' : contentType,
				'User-Agent' : kairosUserAgent,
				'Content-Length' : post_data.length
			}
		};

		if (headers) {
			options.headers = merge(options.headers, headers);
		}

		comms.doRequest(hostname + path, options, done, post_data);

	};

	this.kairosGet = function(path, done, host) {
		var allData = [];

		var options = {
			host : host || kairosHostname,
			port : kairosPort,
			ssl : true,
			path : path,
			method : 'GET',
			headers : {
				'User-Agent' : nestExports.userAgent,
				'Accept-Language' : 'en-us',
			}
		};

		comms.doRequest(options.host + options.path, options, done, allData);
	};

	this.pushData = function(data) {
		var settings = {			
			ssl : false,
			path : '/api/v1/datapoints',
			body : JSON.stringify(data),
			done : function(data) {
				console.log('Posted to datastore');
			}
		};

		this.kairosPost(settings);
	};
}

module.exports = Kairos;

// (function() {"use strict";
// 
	// var queryString = require('querystring'), url = require('url'), util = require('util'), comms = require('./communications.js');
// 
	// var kairosSession = {};
// 
	// // Post data to Nest.
	// // Settings object
	// //   {
	// //      hostname: string, usually set to the transport URL (default)
	// //      port: defaults to 443, override here
	// //      path : string
	// //      body : string or object, if string, sent as is
	// //              if object, converted to form-url encoded
	// //              if body is string, content-type is auto set to
	// //              application/json
	// //              otherwise, set to urlencoded
	// //              override this value with the headers param if
	// //              needed
	// //      headers: { headerName: Value }
	// //      done: callback function
	// //   }
// 
// 	
// 
	// // exported function list
	// var kairosExports = {
		// 'post' : postData,
		// 'logger' : {
			// error : function(msg, props) {
				// console.log(msg);
				// if (!!props)
					// console.trace(props.exception);
			// },
			// warning : function(msg, props) {
				// console.log(msg);
				// if (!!props)
					// console.log(props);
			// },
			// notice : function(msg, props) {
				// console.log(msg);
				// if (!!props)
					// console.log(props);
			// },
			// info : function(msg, props) {
				// console.log(msg);
				// if (!!props)
					// console.log(props);
			// },
			// debug : function(msg, props) {
				// console.log(msg);
				// if (!!props)
					// console.log(props);
			// }
		// }
	// };
// 
	// var root = this;
	// // might be window ...
	// if (typeof exports !== 'undefined') {
		// if ( typeof module !== 'undefined' && module.exports) {
			// exports = module.exports = kairosExports;
		// }
		// exports.kairos = kairosExports;
	// } else {
		// root.kairos = kairosExports;
	// }
// 
// })();
