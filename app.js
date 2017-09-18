var bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    override = require("method-override"),
    sanitizer = require("express-sanitizer"),
    app = express();

// App config   
mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(override("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());

// Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({
//     title: "Test Blog",
//     image: "https://cdn.pixabay.com/photo/2017/04/04/14/23/peacock-2201428__480.jpg",
//     body: "Blah blah blah testing testing"
// });

// Restful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
    
});

// New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// Create Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
});

// Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

// Update
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

// Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
          res.redirect("/blogs");  
        } else {
            res.redirect("/blogs");
        }
    });
})
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog app started!");
})
