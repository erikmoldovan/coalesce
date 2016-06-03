// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var fs         = require('fs');
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

	router.get('/getEvents', function(req, res) {
		console.log(req.query.zip);
	    meetup.getOpenEvents({
			zip: req.query.zip
		}, function(error, events) {
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