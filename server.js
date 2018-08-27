var express = require("express");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var axios = require("axios");
var mongoose = require("mongoose")

// Require all models
var db = require("./models");

var PORT = 3000
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Initialize Express
var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scapper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


app.get("/scrape", function (req, res) {

axios.get("https://www.npr.org/sections/thetwo-way/").then(function (response) {

  var $ = cheerio.load(response.data);

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("h2.title").each(function (i, element) {
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
    .children("a")
    .text();
    result.link = $(this)
    .children("a")
    .attr("href");
    // console.log(result);

    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });

    res.send("Scraped!!!");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// app.get("/", function(req,res){
//     // Query: In our database, go to the animals collection, then "find" everything
//     db.articles.find({}, function(error, found) {
//       // Log any errors if the server encounters one
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise, send the result of this query to the browser
//       else {
//         res.json(result.title);
//       }
//     });
// });


// Set the app to listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});



 