const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const bodyParser = require("body-parser");
var _ = require("lodash");

app.use(bodyParser.urlencoded({ extended: true }));

var titleList = [];
var blogList = [];
var total = "";

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});

app.post("/compose", function (req, res) {
  var title = req.body.title.toUpperCase();
  var blog = req.body.blogPost;

  titleList.push(title);
  blogList.push(blog);

  res.redirect("/");
});
app.get("/", function (req, res) {
  var day = date.getDate();
  var time = date.getTime();
  total = day + "," + time;
  res.render("home", {
    listTitle: titleList,
    postBlog: blogList,
    newDay: total,
  });
});
app.get("/post/:postTitle", function (req, res) {
  for (var i = 0; i < titleList.length; i++) {
    if (
      _.lowerCase([(string = req.params.postTitle)]) ===
      titleList[i].toLowerCase()
    ) {
      res.render("post", {
        listTitle: titleList[i],
        postBlog: blogList[i],
        newDay: total,
      });
    }
  }
});
app.get("/aboutUs", function (req, res) {
  res.render("aboutUs");
});
app.get("/contactUs", function (req, res) {
  res.render("contactUs");
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
