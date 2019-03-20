var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var express = require('express');
	app = express();

	app.get ('/receptes/llista', function(req, res){

		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

		  dbo.collection("cocina").find({}).toArray(function(err, result) {
		    if (err) throw err;
		    result.forEach(function(receta){
		    console.log(result);
		    res.send(result);	
		    });

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
