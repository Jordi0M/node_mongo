var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var $ = require('jquery');
fs = require('fs');

var express = require('express');
	app = express();

	app.get ('/', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

		  dbo.collection("recetas").find({}).toArray(function(err, result) {
			  var lista = "";
		    if (err) throw err;
				   boton_crear = "<a href=/crear>Añadir</a><br><br>";
				   for (const key in result) {

						li_nombre = "<li>"+result[key]["nombre"]+"</li>";

						id_asociada = result[key]["_id"];
						boton_editar = "<a href=/editar/"+id_asociada+">Editar</a>\t";
						boton_borrar = "<a href=/borrar/"+id_asociada+">Borrar</a><br>";
						lista_sin_sumar = li_nombre+boton_editar+boton_borrar;
						lista = lista + lista_sin_sumar;
				   }
				   res.send(boton_crear+lista);
					
		    	/*
		    result.forEach(function(receta){
		    });
		    */
		    db.close();
		  });
		});	
	});

	app.get ('/crear', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

			var formulario = '<form method="POST" action="/crear">\
				<label for="nombre">Nombre</label>\
				<input type="text" name="nombre">\
				<br>\
				<label for="duracion">Duracion</label>\
				<input type="text" name="duracion">\
				<br>\
				<label for="descripcion">Descripcion</label>\
				<input type="text" name="descripcion">\
				<br>\
				<label for="tipo">Tipo</label>\
				<input type="text" name="tipo">\
				<br>\
				<input type="submit">\
			</form>';
			

		  res.send(formulario);

		});	
	});

	app.post ('/crear', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

			
			

		  res.send(formulario);

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