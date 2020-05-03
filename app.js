var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

var Blog = require("./models/blog.js");
var User = require("./models/user.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// app config
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/blog_app", {
  useNewUrlParser: true,
});

// RESTful routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", (req, res) => {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });

  // User.findOne({name: "mpc"}).populate("posts").exec(function(err, user) {
  //   console.log(user);
  // });
});

// NEW
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE
app.post("/blogs", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, blog) {
    if (err) {
      res.render("new");
    } else {
      User.findOne({ name: "mpc" }, function (err, user) {
        if (!err) {
          user.posts.push(blog._id);
          user.save(function (err, data) {
            console.log(data);
          });
        }
      });
      res.redirect("/blogs");
    }
  });
});

// user route
app.get("/blogs/login", (req, res) => {
  res.render("newUser");
});

app.post("/blogs/user", (req, res) => {
  User.create(req.body.user, function (err, user) {
    if (err) {
      res.render("newUser");
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: blog });
    }
  });
});

// EDIT
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: blog });
    }
  });
});

//UPDATE
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    res.redirect("/blogs");
  });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
