var express = require('express');
var cors = require('cors');
require('dotenv').config()
var app = express();

//////////////////////////////////////////////////

var multer = require("multer");

//////////////////////////////////////////////////

app.use(cors());

// Access css file
app.use('/public', express.static(process.cwd() + '/public'));

// Access html file
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});


//////////////////////////////////////////////////
// MY SOLUTION STARTS HERE

// MULTER MIDDLEWARE
app.use(multer().single("upfile"));

// See index.html, form. 
app.post("/api/fileanalyse", (req, res) => {
  //console.log(req.file);
  res.json({
    "name": req.file.originalname, 
    "type": req.file.mimetype, 
    "size": req.file.size
  });
});

// MY SOLUTION ENDS HERE
//////////////////////////////////////////////////

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
