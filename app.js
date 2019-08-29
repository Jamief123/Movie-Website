const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

var app = express();
const PORT = 3000;

dotenv.config();
const APIKey = process.env.TMDB_API_KEY;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));


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
    var url = `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKey}&language=en-US`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('movies/show', {data: data});
        }
        else{
            console.log(err);
            res.redirect("/");
        }
    })
});

app.post("/search/", (req, res) => {
    var query = req.body.Search;
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}4&language=en-US&query=${query}&page=1&include_adult=false`;
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


