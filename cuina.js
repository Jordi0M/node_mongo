var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var $ = require('jquery');

var express = require('express');
	app = express();

	app.get ('/receptes', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

		  dbo.collection("recetas").find({}).toArray(function(err, result) {
		    if (err) throw err;
		   		console.log(result);
					res.send("<li>Hola</li>");
					
		    	/*
		    result.forEach(function(receta){
		    });
		    */
		    db.close();
		  });
		});	
	});

	app.use(function(req, res){

		res.sendStatus(404);
	});

	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Express server listening on port %s', port);
	});

function generarDatos(){
$("body").append("p");
}