const dotenv = require("dotenv");
const express = require("express");
const request = require('request');
var app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;

//app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    var query = "language=en-US&page=1";
    var url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&${query}`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('index', {data: data});
        }
    });
});

app.get("/movies/:id", (req, res) => {
    var id = req.params.id;
    var url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('movies/show', {data: data});
        }
        else{
            res.send("uh oh");
        }
    })
});

app.get("/search/:query", (req, res) => {
    var query = req.params.query;
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}4&language=en-US&query=${query}&page=1&include_adult=false`;
    request(url, (err, response, body) => {
        if(!err && response.statusCode ==200){
            var data = JSON.parse(body);
            console.log(data);
            res.render("results", {data: data});
        }
    })
});

app.listen(PORT, () => {
    console.log('JMDB Online on port: ' + PORT);
});


