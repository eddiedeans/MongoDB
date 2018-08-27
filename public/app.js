// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
    $("#articles").append("<p href='" + data[i].link + "'>" + data[i].title + "</p>");

  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {

  // Some how get this link to open on click

  
});
