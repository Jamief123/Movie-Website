const dotenv = require("dotenv");
const express = require("express");
var User = require("./models/user");
var Review = require("./models/reviews")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const request = require('request');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var app = express();
const PORT = 3000;
dotenv.config();
const APIKey = process.env.TMDB_API_KEY;
var middleware = require("./middleware");

mongoose.connect("mongodb://localhost/jmdb", {useNewUrlParser: true}); 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


//---------ROUTES----------//

app.get("/register", (req, res) => { 
    res.render("register");
});

//show login form
app.get("/login", (req, res) => {
    res.render("login");
});


//Handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), (req, res) => {
    
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


app.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username, email: req.body.email})
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            console.log(newUser);
            console.log(req.body);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
        res.redirect("/register");
        });
    });
});

app.get("/:page", (req, res) => {
    var pageNum = req.params.page;
    var query = `language=en-US&page=${pageNum}`;
    var url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKey}&${query}`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('index', {data: data});
        }
    });
});

app.get("/movies/:id", (req, res) => {
    var id = req.params.id;
    var url = `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKey}&append_to_response=credits`;
    var data = [];
    var reviews = Review.find({movieID: id}, (err, foundReview) => {
        if(err){
            console.log(err);
        }else{
            request(url, (err, response, body) => {
                if(!err && response.statusCode ==200){
                    var movie = JSON.parse(body);
                    data.push(movie);
                    data.push(foundReview);
                    //push both objects into array so they can be passed into ejs template
                    console.log(data[1].length);
                    res.render('movies/show', {data: data});
                    //res.send(data);
                }
                else{
                    res.redirect("/");
                }
            })
            
        }
    });
    
});

//handle logic for adding new review
app.post("/reviews/new", middleware.isLoggedIn, (req, res) =>{

    var movieID = req.body.movieId;
    var content = req.body.content;
    var user = res.locals.currentUser;
    var review = new Review({movieID: movieID, content: content, user: user}); //create mongoose object
    review.save((err, review) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
});

app.post("/search/", (req, res) => {
    var query = req.body.Search;
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=${query}&page=1&include_adult=false`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            console.log(data);
            res.render("results", {data: data});
        }
    })
});

app.get("", (req, res) => {
    var query = "language=en-US&page=1";
    var url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKey}&${query}`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('index', {data: data});
        }
    });
});

app.listen(PORT, () => {
    console.log('JMDB Online on port: ' + PORT);
});


