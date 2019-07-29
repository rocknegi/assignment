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
    // res.send(results);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<!DOCTYPE html><html lang="en"><head>');
    res.write('<meta charset="utf-8">');
    res.write('</head><body>');
    res.write('<style>img {display: block;margin-left: auto;margin-right: auto;}</style>');
    res.write('Username:<label>'+ results[0].username +'</label><br>');
    res.write('Name:<label>'+ results[0].Name +'</label><br>');
    res.write("<img src='" + results[0].Avatar_url+ "'/><br>")
    res.write('Bio:<label>'+ results[0].Bio +'</label><br>');
    res.write('Public_repos:<label>'+ results[0].Public_repos +'</label><br>');
    res.write('Public_gists:<label>'+ results[0].Public_gists +'</label><br>');
    res.write('Followers:<label>'+ results[0].Followers +'</label><br>');
    res.write('Following:<label>'+ results[0].Following +'</label><br>');
    res.write('</body></html>');
    res.end();
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
  //  res.send(json);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<!DOCTYPE html><html lang="en"><head>');
    res.write('<meta charset="utf-8">');
    res.write('</head><body>');
    res.write('Username:<label>'+ json.login+'</label><br>');
    res.write('Name:<label>'+ json.name +'</label><br>');
    res.write("<img src='" + json.avatar_url+ "'/><br>")
    res.write('Bio:<label>'+ json.bio +'</label><br>');
    res.write('Public_repos:<label>'+ json.public_repos +'</label><br>');
    res.write('Public_gists:<label>'+ json.public_gists +'</label><br>');
    res.write('Followers:<label>'+ json.followers +'</label><br>');
    res.write('Following:<label>'+ json.following +'</label><br>');
    res.write('</body></html>');
    res.end();
    });
 };
})

app.listen(3000, function() {
  console.log('Server running at localhost:3000');
});



