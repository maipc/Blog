var bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// app config
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/blog_app", {
  useNewUrlParser: true,
});

// mongoose/model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTful routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
