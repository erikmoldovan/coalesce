// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var querystring = require('querystring');
var https =      require('https');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9000;        // set our port
var host = "api.meetup.com";
var apiKey = "1142381b68362c61371669687e3d6db";

// Endpoints
var endpoints = {
	open_events: "/2/open_events"
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);




// function performRequest(endpoint, method, data, success) {
//   var dataString = JSON.stringify(data);
//   var headers = {};
  
//   if (method == 'GET') {
//     endpoint += '?' + querystring.stringify(data);
//   }
//   else {
//     headers = {
//       'Content-Type': 'application/json',
//       'Content-Length': dataString.length
//     };
//   }
//   var options = {
//     host: host,
//     path: endpoint,
//     method: method,
//     headers: headers
//   };

//   var req = https.request(options, function(res) {
//     res.setEncoding('utf-8');

//     var responseString = '';

//     res.on('data', function(data) {
//       responseString += data;
//     });

//     res.on('end', function() {
//       console.log(responseString);
//       var responseObject = JSON.parse(responseString);
//       success(responseObject);
//     });
//   });

//   req.write(dataString);
//   req.end();
// }