require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

/////////////////////////////////////////
// REQUIRE BODY PARSER
let bodyParser = require("body-parser")
// MONGOOSE
let mongoose = require('mongoose');

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }))

// Database Password
const password = process.env['MONGO_URI'];

// My data uri + password
const uri = "mongodb+srv://rodrigo_serra:" + password + "@cluster0.vtsvf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Connect database to server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/////////////////////////////////////////

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Access css file
app.use('/public', express.static(`${process.cwd()}/public`));

// Access html file
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


//////////////////////////////////////////////////
// MY SOLUTION STARTS HERE

// Schema
let urlSchema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: Number
});

// Create Model from Schema
// Will generate new collection "url"
// This collection will store documents (in this case urls) with urlSchema format
// This collection (url) is stored in the myFirstDatabase database, in cluster0
let urlModel = mongoose.model("url", urlSchema, "url");

// Test url
// https://dev.to/calvinpak/simple-url-validation-with-javascript-4oj5
const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    //console.error(e);
    return false;
  }
  return true;
};

// New document (instance of a model, i.e, new url)
// Testing purposes only
const createAndSaveUrl = (urlString, num) => {
  let link = new urlModel({original_url: urlString, short_url: num});
  link.save((error, data) => {
    if(error){
      console.log(error);
    }
  });
};
//createAndSaveUrl("https://www.google.com", 1);
//createAndSaveUrl("https://replit.com/@serraRfs/boilerplate-project-urlshortener#server.js", 2);


// In the form (views/index.html) we can see POST method and the route "/api/shorturl". The name is "url"
app.post("/api/shorturl", (req, res) => {
  //console.log(req.body.url);

  let postUrl = req.body.url;
  let latestShortUrl;

  // Extra help for url validation (maybe this alone would be enough)
  let regUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  // Find the latest short_url
  urlModel.findOne({})
          .sort({short_url: 'desc'})
          .limit(1)
          .select("short_url")
          .exec((error, data) => {
            if(error){
              // Error case
              console.log(error);
            } else if(data === null) {
              // The collection hasn't been initialzed yet
              latestShortUrl = 1;
            } else {
              // Get the short_url of the last entrie
              latestShortUrl = data.short_url + 1;
              //console.log(latestShortUrl);
            }
          });


  // Verify is URL is valid
  if(!isValidUrl(postUrl) || !regUrl.test(postUrl)) {
    res.json({ error: "invalid url"});
  } else {
    // Check if url is in the database already
    urlModel.findOne({ original_url: postUrl}, (err, data) => {
      if(err) {
        // Error case
        console.log(err);

      } else if (data === null) {
        // The url does not exist in the database
        //console.log("Does not exist");
        //console.log(data);

        // Call function to generate document in Collecion
        createAndSaveUrl(postUrl, latestShortUrl);
        // Generate json response
        res.json({ original_url: postUrl, short_url: latestShortUrl });

      } else {
        // The url exists and already has a short_url
        //console.log("Exists");
        //console.log(data);

        // Generate json response with already existing url
        res.json({ original_url: data.original_url, short_url: data.short_url });
      }
    });
  }
})

app.get("/api/shorturl/:number", (req, res) => {
  
  let requiredShortUrl = req.params.number;

  urlModel.findOne({ short_url: requiredShortUrl}, (err, data) => {
    if(err) {
      // Error case
      console.log(err);
    } else if(data === null) {
      // The request short_url does not exist
      res.json({ error: "invalid url"});
    } else {
      // Redirects user to the desired url
      res.redirect(data.original_url);
    }
  });

});

// MY SOLUTION ENDS HERE
//////////////////////////////////////////////////



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
