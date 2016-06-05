// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var fs         = require('fs');
// var zipcodes   = require('zipcodes');
var cities	   = require('cities');
var meetup;

fs.readFile('./api/key.txt', 'utf8', function read(err, data) {
    if (err) throw err;
    key = data;

    linkWithMeetup(data);
});

var linkWithMeetup = function(key) {
	meetup = require('meetup-api')({
		key: key
	});

	initApp();
};

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var port = process.env.PORT || 9000;        // set our port

var initApp = function() {
	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.json({ message: 'hooray! welcome to our api!' });
	});

	router.get('/getLatLong', function(req, res) {
		// var position = zipcodes.lookup(req.query.zip);
		var position = cities.zip_lookup(req.query.zip);
		console.log(position);

		res.json(position);
	});

	router.get('/getZip', function(req, res) {
		var zip = cities.gps_lookup(req.query.lat, req.query.lon);

		console.log(zip);
		res.json(zip);
	});

	router.get('/getOpenEvents', function(req, res) {
		var input = req.query.searchArea;

		var isZip = /^\d+$/.test(input);
		var searchCriteria = {};

		if (isZip) {
			if (input.length === 5/* || input.length === 9*/) {
			   searchCriteria.zip = input;
			} else {
				throw error;
			}
		} else if (!isZip) {
			// searchCriteria.city = input;
			throw error;
		} else {
			throw error;
		}

	    meetup.getOpenEvents(searchCriteria, function(error, events) {
			if (error) {
				console.log(error);
			} else {
				res.json(events);
			}
		});
	});

	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	// START THE SERVER
	// =============================================================================
	app.listen(port);
	console.log('Magic happens on port ' + port);
};