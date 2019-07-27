const fetch = require('node-fetch');
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test",
    database: "Sample"
  });

var x;
app.use(bodyParser.urlencoded({ extended: true })); 


app.post('/myaction', function(req, res) {
  x = req.body.name;

  let sqlQuery = "SELECT * FROM Users WHERE username = ? LIMIT 1";
con.query(sqlQuery, x, function(error, results){
	if(error){
		callback(error);
		return;
	}
 
	if(results.length){
    console.log(results[0].username);
    res.send(results);
	}else{
    console.log("not found in db");
    getUser(x);
	}
});


function getUser(name){
  fetch(`https://api.github.com/users/${name}`)
   .then(function(response) {
     return response.json();
   })
   .then(function(json) {
     console.log(json.login);
     con.query("INSERT INTO Users (username, Name, Avatar_URL, Bio, Public_repos, Public_gists, Followers, Following) VALUES ('"+json.login+"', '"+json.name+"', '"+json.avatar_url+"','"+json.bio+"','"+json.public_repos+"','"+json.public_gists+"','"+json.followers+"','"+json.following+"')")
   res.send(json);
    });
 };
})

app.listen(3000, function() {
  console.log('Server running at localhost:3000');
});



