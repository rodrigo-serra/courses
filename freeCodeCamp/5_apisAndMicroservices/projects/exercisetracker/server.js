const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

/////////////////////////////////////////
// REQUIRE BODY PARSER
let bodyParser = require("body-parser")
// MONGOOSE
let mongoose = require('mongoose');

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }))

// Database Password
const password = process.env['MONGO_URI'];

// My database uri + password
const uri = "mongodb+srv://rodrigo_serra:" + password + "@cluster0.vtsvf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Connect database to server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/////////////////////////////////////////

app.use(cors())
// Access css file
app.use(express.static('public'))
// Access html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//////////////////////////////////////////////////
// MY SOLUTION STARTS HERE

// Activity Schema
// Each athlete will have a log parameter where it will be saved all activities in the format of activitySchema
let activitySchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});

// Athlete Schema
let athletesSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [activitySchema]
});

// Create Model from Schema
// This line per si, does not generate collection.
// Once an "athlete" is saved, the collection is created.
// The activities will not generate new collection per athlete.
// It will create sort of a sub-collection per athlete, within the athletes collection
let athletesModel = mongoose.model("athletes", athletesSchema, "athletes");
let activities = mongoose.model("activities", activitySchema);


// New document (instance of a model, i.e, new athlete)
const createAndSaveAthlete = (athleteName, res) => {
  let athlete = new athletesModel({username: athleteName});
  athlete.save((error, data) => {
    if(error){
      console.log(error);
    }else{
      res.json({"username": data.username, "_id": data._id});
    }
  });
};


// ADD NEW ATHLETE
// When the new user is submited, the name is stored in variable called username (see index.html first input field "name")
app.post("/api/users", (req, res) => {
  
  let athleteName = req.body.username;

  // Check if user already exists
  athletesModel.findOne({ username: athleteName }, (error, data) => {
    if(error){
      // Error case
      console.log(error);
    } else if (data === null) {
      // The athlete name is not in the database
      createAndSaveAthlete(athleteName, res);
    } else {
      // There is a user with that name. Must select another username.
      res.send("Username already taken!");
    }
  });
});

// PRINT ALL ATHLETES IN THE DATABASE
app.get("/api/users", (req, res) => {
  athletesModel.find({})
               .select("-log")
               .exec((error, data) => {
                  if(error) {
                    // Error case
                    console.log(error);
                  } else if (data.length === 0) {
                    // Database is empty
                    res.send("Empty database (no athletes)");
                  } else {
                    res.json(data);
                  }
               })
});

// ADD NEW ACTIVITY TO ATHLETE BY ID
// See index.html.
// req.body are going to be _id, description, duration and date
// re.params also sends the id
app.post("/api/users/:_id/exercises", (req, res) => {

  let userId = req.params._id;
  let description = req.body.description;
  let duration = parseInt(req.body.duration);
  let date = req.body.date;

  //console.log("userId: " + userId);
  //console.log("description: " + description);
  //console.log("duration: " + duration);
  //console.log("date: " + date);

  if(description === ''){
    res.send("Description parameter is required!");
  } else if (isNaN(duration)) {
    res.send("Duration parameter is required!");
  } else if (date === "" || date === undefined) {
    date = new Date();
    addActivity(req, res, userId, description, duration, date);
  } else {
    date = new Date(date);
    isNaN(date.getTime()) ? res.send("Invalid date paramater!") : addActivity(req, res, userId, description, duration, date);
  }
});

const addActivity = (req, res, userId, descrip, dur, dat) => {
  //Check if user Id is valid
  athletesModel.findById(userId, (error, data) => {
    if(error){
      // Error case
      console.log(error);
    } else if(data === null) {
      // The user does not exist in the database
      res.send("Wrong id or user not available!");
    } else {
      //console.log("userId: " + userId);
      //console.log("username: " + data.username);
      //console.log("description: " + descrip);
      //console.log("duration: " + dur);
      //console.log("date: " + (dat.toString()).substring(0, 15));

      let newActivity = new activities({
        description: descrip, 
        duration: dur,
        date: (dat.toString()).substring(0, 15)
      });

      data.log.unshift(newActivity);
      data.save((e, d) => {
        if(e){
          console.log(e);
        } else {
          res.json({
            "_id": userId, 
            "username": data.username, 
            "date": (dat.toString()).substring(0, 15),
            "duration": dur,
            "description": descrip
          });
        }
      });
    }
  });
};

// PRINT ATHLETE ACTIVITIES
// req.query may include a from, to and limit parameters
app.get("/api/users/:_id/logs", (req, res) => {
  if(Object.keys(req.query).length === 0) {
    // No from, to and/or limit
    printAthleteLogs(req, res, false);
  } else {
    if((req.query).hasOwnProperty("limit")) {
      printAthleteLogs(req, res, true);
    } else {
      printAthleteLogsQuery(req, res);
    }
  }
});

// No restrictions or limit restriction
const printAthleteLogs = (req, res, limitSwitch) => {
  athletesModel.findById(req.params._id, (error, data) => {
    if(error){
      // Error case
      console.log(error);
    } else if(data === null) {
      // The user does not exist in the database
      res.send("Wrong id or user not available!");
    } else {
      // Activity id must not be included in res.json
      let noIdLog = data.log.map(activity => {
        return {
          "description": activity.description,
          "duration": activity.duration,
          "date": activity.date
        }
      });

      // Limit restriction
      if(limitSwitch){
        noIdLog.splice(0, req.query.limit);
      }

      res.json({
            "_id": data._id, 
            "username": data.username, 
            "count": noIdLog.length,
            "log": noIdLog
      });
    }
  });
}

// Restrictions case (from, to)
const printAthleteLogsQuery = (req, res) => {
  athletesModel.findById(req.params._id, (error, data) => {
    if(error){
      // Error case
      console.log(error);
    } else if(data === null) {
      // The user does not exist in the database
      res.send("Wrong id or user not available!");
    } else {
      // Get Dates (must be verified)
      let fromDate = new Date(req.query.from);
      let toDate = new Date(req.query.to);
      
      // Maybe a for loop would be enough considering we are looping the array twice
      let log = data.log.filter(activity => {
        let d = (new Date(activity.date)).getTime();
        return (d >= fromDate.getTime() && d <= toDate.getTime());
      });
      let noIdLog = log.map(activity => {
        return {
          "description": activity.description,
          "duration": activity.duration,
          "date": activity.date
        }
      });

      res.json({
            "_id": data._id, 
            "username": data.username,
            "from":  (fromDate.toString()).substring(0, 15),
            "to": (toDate.toString()).substring(0, 15),
            "count": noIdLog.length,
            "log": noIdLog
      });
    }
  });
}
// MY SOLUTION ENDS HERE
//////////////////////////////////////////////////




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
