const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const bodyParser = require("body-parser");
var _ = require("lodash");

//mongoose database
const mongoose = require("mongoose");

main().catch((err) => console.log(err));
//mongodb+srv://saradChhetri:<password>@atlascluster.x8spv7w.mongodb.net/?retryWrites=true&w=majority

async function main() {
  const username = "saradChhetri";
  const password = encodeURIComponent("Lu77pa@7882");

  await mongoose.connect(
    "mongodb+srv://" +
      username +
      ":" +
      password +
      "@atlascluster.x8spv7w.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );
}

const blogSchema = new mongoose.Schema({
  title: String,
  date: String,
  blog: String,
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, function (req, res) {
  console.log("server is running at port 3000");
});
var titleList = [];
var blogList = [];
var total = "";
var dateList = [];

app.post("/compose", function (req, res) {
  var title = req.body.title.toUpperCase();
  var blogFromCompose = req.body.blogPost;

  var day = date.getDate();
  var time = date.getTime();
  total = day + "," + time;

  const newBlog = new Blog({
    title: title,
    blog: blogFromCompose,
    date: total,
  });

  newBlog.save();

  res.redirect("/");
});

app.get("/", function (req, res) {
  var day = date.getDate();
  var time = date.getTime();
  total = day + "," + time;
  try {
    Blog.find({}, function (err, foundBlogs) {
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < foundBlogs.length; i++) {
          titleList.push(foundBlogs[i].title);
          blogList.push(foundBlogs[i].blog);
          dateList.push(foundBlogs[i].date);
        }
      }
      console.log(titleList.length);
      res.render("home", {
        listTitle: titleList,
        postBlog: blogList,
        newDay: dateList,
      });
      titleList = [];
      blogList = [];
      dateList = [];
    });
  } catch (err) {
    console.log(error);
  }
});
app.get("/new", function (req, res) {
  res.render("new");
});
app.get("/post/:postTitle", function (req, res) {
  Blog.find({}, function (err, foundBlogs) {
    if (err) {
      console.log(err);
    } else {
      for (var i = 0; i < foundBlogs.length; i++) {
        if (
          _.lowerCase([(string = req.params.postTitle)]) ===
          foundBlogs[i].title.toLowerCase()
        ) {
          res.render("post", {
            listTitle: foundBlogs[i].title,
            postBlog: foundBlogs[i].blog,
            newDay: foundBlogs[i].date,
            foundBlogs: foundBlogs[i],
          });
        }
      }
    }
  });
  // for (var i = 0; i < titleList.length; i++) {
  //   if (
  //     _.lowerCase([(string = req.params.postTitle)]) ===
  //     titleList[i].toLowerCase()
  //   ) {
  //     res.render("post", {
  //       listTitle: titleList[i],
  //       postBlog: blogList[i],
  //       newDay: dateList[i],
  //     });
  //   }
  // }
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
app.post("/delete", function (req, res) {
  console.log(req.body);
  Blog.findByIdAndRemove(req.body.item, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("delete by ID");
    }
  });
  res.redirect("/");
});
