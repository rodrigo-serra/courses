// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//////////////////////////////////////////////////
// MY SOLUTION STARTS HERE

// Function to Validate Date
// There are functions to test Dates. For this project, we are going to do our own

// The miliseconds format is in string format, therefore it is tested here
const isValidDate = (num) => {
  let reg = /^\d+$/;
  return reg.test(num);
};

app.get("/api", (req, res) => {
 let d = new Date();
 res.json({"unix": d.getTime(), "utc": d.toGMTString()});
});

// If the date has an invalid format, isNaN() will return true because d.getTime() returns NaN
app.get("/api/:date", (req, res) => {
  let d;

  if(isValidDate(req.params.date)) {
    d = new Date(parseInt(req.params.date));
  } else {
    d = new Date(req.params.date)
  }

  if(isNaN(d.getTime())) {
    res.json({error : "Invalid Date"})
  } else {
    res.json({"unix": d.getTime(), "utc": d.toGMTString()})
  }
});


// MY SOLUTION ENDS HERE
//////////////////////////////////////////////////


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
