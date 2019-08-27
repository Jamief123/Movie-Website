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
    var url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY + '&' + query;
    request(url, (error, response, body) => {
        if(!error && response.statusCode ==200){
            var data = JSON.parse(body);
            res.render('index', {data: data});
        }
    });
});

app.get("/movies/:search", (req, res) => {
    var searchTerm = req.params.search;
    res.render("results");
});

app.listen(PORT, () => {
    console.log('JMDB Online on port: ' + PORT);
});


